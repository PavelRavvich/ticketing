import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { createTicket, signIn } from "../../test/setup";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if provided id not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signIn())
    .send({
      title: "title",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the does not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "title",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the does not own the ticket", async () => {
  const firstUserCookie = signIn();
  const secondUserCookie = signIn();
  const title = "title";
  const price = 20;

  const response = await createTicket(firstUserCookie, title, price)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", secondUserCookie)
    .send({
      title: "title2",
      price: 20,
    })
    .expect(401);
});

it("returns a 400 if the user provide invalid title or price", async () => {
  const title = "title";
  const price = 20;
  const cookie = signIn();

  const response = await createTicket(cookie, title, price)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: -20,
    })
    .expect(400);
});

it("updates the ticket provided valid input", async () => {
  const title = "title";
  const price = 20;
  const cookie = signIn();

  const response = await createTicket(cookie, title, price)

  const updatedTicket = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title2",
      price: 40,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(updatedTicket.body.title).toEqual("title2");
  expect(updatedTicket.body.price).toEqual(40);
  expect(ticketResponse.body.title).toEqual("title2");
  expect(ticketResponse.body.price).toEqual(40);
});

it('publishes an event', async () => {
  const title = "title";
  const price = 20;
  const cookie = signIn();

  const response = await createTicket(cookie, title, price)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title2",
      price: 40,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = signIn();
  const response = await createTicket(cookie, "title", 20)

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "title2",
      price: 40,
    })
    .expect(400);
});
