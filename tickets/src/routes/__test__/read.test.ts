import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { createTicket, signIn } from "../../test/setup";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .send({})
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "title";
  const price = 20;
  const cookies = signIn();

  const response = await createTicket(cookies, title, price);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookies)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it('can fetch a list of tickets', async () => {
  const cookies = signIn();

  await createTicket(cookies, 'title1', 10);
  await createTicket(cookies, 'title2', 20);

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});


