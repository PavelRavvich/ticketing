import express, { Request, Response, Router } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@pravvich-tickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";

import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

import { Order, OrderDoc } from "../models/order";
import { Ticket } from "../models/ticket";


const router: Router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {

    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved: boolean = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const order: OrderDoc = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: new Date(Date.now() + EXPIRATION_WINDOW_SECONDS * 1000),
      ticket
    });
    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });

    res.status(201).send(order);
});

export { router as createOrderRouter };
