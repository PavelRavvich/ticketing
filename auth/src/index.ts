import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { sinnInRouter } from './routes/sign-in';
import { sinnUpRouter } from './routes/sign-up';
import { sinnOutRouter } from './routes/sign-out';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";

const app: Express = express();
app.use(json());

app.use(sinnInRouter);
app.use(sinnUpRouter);
app.use(sinnOutRouter);
app.use(currentUserRouter);

app.all('*', async (): Promise<void> => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async (): Promise<void> => {
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
