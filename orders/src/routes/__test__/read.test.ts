import request from "supertest";
import { app } from "../../app";
import { signIn } from "../../test/setup";
import { Ticket, TicketDoc } from "../../models/ticket";


const buildTicket = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20
  });
  await ticket.save();
  return ticket;
}

it("fetches order for a particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = signIn();
  const userTwo = signIn();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two order as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
  const ticket = await buildTicket();

  const userOne = signIn();
  const userTwo = signIn();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .expect(401);
});

it("fetches an order", async () => {
  const ticket = await buildTicket();

  const user = signIn();

  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(createdOrder.id);
});
