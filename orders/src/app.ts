import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@pravvich-tickets/common";

import { createOrderRouter } from './routes/create';
import { readOrderRouter } from './routes/read';
import { updateOrderRouter } from './routes/update';

const app: Express = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createOrderRouter);
app.use(readOrderRouter);
app.use(updateOrderRouter);

app.all('*', async (): Promise<void> => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
