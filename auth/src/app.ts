import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@pravvich-tickets/common";

import { signInRouter } from "./routes/sign-in";
import { signUpRouter } from "./routes/sign-up";
import { signOutRouter } from "./routes/sign-out";
import { currentUserRouter } from "./routes/current-user";

const app: Express = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
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

export { app };
