import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@pravvich-tickets/common";


import { createTicketRouter } from './routes/create';
import { readTicketRouter } from './routes/read';
import { updateTicketRouter } from './routes/update';

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

app.use(createTicketRouter);
app.use(readTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (): Promise<void> => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
