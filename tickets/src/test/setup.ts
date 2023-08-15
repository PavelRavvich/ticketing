import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";

let mongo: MongoMemoryServer;

jest.mock("../nats-wrapper");

beforeAll(async (): Promise<void> => {
  process.env.JWT_KEY = "test-jwt-key";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async (): Promise<void> => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

export const signIn = (): string[] => {
  const token = jwt.sign({
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: token });
  const base64Session = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64Session}`];
};

export const createTicket = (cookies: string[], title: string, price: number): Promise<any> => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookies)
    .send({
      title,
      price,
    });
};
