import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/setup";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@pravvich-tickets/common";
import { natsWrapper } from "../../nats-wrapper";

it("return an error if the ticket not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({ ticketId })
    .expect(404);
});

it("return an error if the ticket already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("success ticket reserve", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("created order return in body", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20
  });
  await ticket.save();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(response.body.ticket.id).toEqual(ticket.id);
  expect(response.body.status).toEqual(OrderStatus.Created);
  expect(response.body.expiresAt).toBeDefined();
  expect(response.body.userId).toBeDefined();
});

it("publishes an order created event", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20
  });
  await ticket.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
