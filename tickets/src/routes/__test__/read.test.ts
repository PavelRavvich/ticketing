import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/setup";
import mongoose from "mongoose";

const createTicket = (cookies: string[], title: string, price: number): Promise<any> => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookies)
    .send({
      title,
      price,
    });
};

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


