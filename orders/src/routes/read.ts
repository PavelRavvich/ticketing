import express, { Request, Response, Router } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@pravvich-tickets/common";
import { Order } from "../models/order";


const router:Router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const orders = await Order
      .find({ userId: req.currentUser!.id })
      .populate("ticket");

    res.send(orders);
  });


router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {

    const order = await Order
      .findById(req.params.id)
      .populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as readOrderRouter };
