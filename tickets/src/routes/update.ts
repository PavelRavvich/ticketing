import express, { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from "@pravvich-tickets/common";


const router: Router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title")
      .notEmpty()
      .isLength({ min: 4, max: 20 })
      .withMessage("Title must be between 4 and 20 characters"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

      const { title, price } = req.body;

      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        throw new NotFoundError();
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      ticket.set({
        title,
        price,
      });

      const updatedTicket = await ticket.save();

      res.status(200).send(updatedTicket);
  }
);

export { router as updateTicketRouter };
