import express, { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@pravvich-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router: Router = express.Router();

router.post(
  "/api/tickets",
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

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });

    const createdTicket = await ticket.save();

    res.sendStatus(201).send(createdTicket);
  }
);

export { router as createTicketRouter };
