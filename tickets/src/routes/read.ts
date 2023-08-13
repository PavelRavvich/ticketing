import express, { Request, Response, Router } from "express";
import { NotFoundError } from "@pravvich-tickets/common";
import { Ticket } from "../models/ticket";

const router: Router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(200).send(tickets);
});

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as readTicketRouter };
