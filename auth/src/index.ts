import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from "cookie-session";

import { signInRouter } from './routes/sign-in';
import { signUpRouter } from './routes/sign-up';
import { signOutRouter } from './routes/sign-out';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";

const app: Express = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(currentUserRouter);

app.all('*', async (): Promise<void> => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async (): Promise<void> => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, (): void => {
    console.log("Auth service listening on port 3000");
  });
};

start();
