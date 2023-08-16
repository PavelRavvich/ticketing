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

    const order: OrderDoc | null = await Order.findById(req.params.id);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
});

export { router as updateOrderRouter };
