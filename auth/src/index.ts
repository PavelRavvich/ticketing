import express, { Express } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
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


app.listen(3000, (): void => {
  console.log('Auth service listening on port 3000');
});
