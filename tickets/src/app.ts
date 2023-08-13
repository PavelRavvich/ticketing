import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@pravvich-tickets/common";

const app: Express = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

//...

app.all('*', async (): Promise<void> => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
