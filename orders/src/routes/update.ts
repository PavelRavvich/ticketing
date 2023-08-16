import express, { Request, Response, Router } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  validateRequest,
  requireAuth,
} from "@pravvich-tickets/common";
import { Order, OrderDoc } from "../models/order";
import { param } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";


const router: Router = express.Router();

router.patch(
  "/api/orders/:id",
  requireAuth,
  [
    param("id")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const order: OrderDoc | null = await Order
      .findById(req.params.id)
      .populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    });

    res.send(order);
});

export { router as updateOrderRouter };
