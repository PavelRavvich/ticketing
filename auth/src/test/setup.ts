import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from "supertest";
import { app } from "../app";


let mongo: MongoMemoryServer;

beforeAll(async (): Promise<void> => {
  process.env.JWT_KEY = "test-jwt-key";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async (): Promise<void> => {
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

export const signIn = async (): Promise<string[]> => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signUp")
    .send({ email, password })
    .expect(201);

  return response.get("Set-Cookie");
};
