import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signIn } from "../../test/setup";
import { OrderStatus } from "@pravvich-tickets/common";
import mongoose from "mongoose";

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = signIn();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: cancelledOrder } = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it("return an error if one user tries to cancel another user's order", async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const userOne = signIn();
  const userTwo = signIn();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it("returns an error if user tries to cancel non-existent order", async () => {
  const user = signIn();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/orders/${id}`)
    .set('Cookie', user)
    .send()
    .expect(404);
});

it("returns an error if user tries to cancel order with invalid id", async () => {
  const user = signIn();
  await request(app)
    .patch(`/api/orders/1234`)
    .set('Cookie', user)
    .send()
    .expect(400);
});
