import Queue from 'bull';
import { natsWrapper } from '../nats-wrapper';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';

export interface ExpirationPayload {
  orderId: string;
}

const expirationQueue = new Queue<ExpirationPayload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job: Queue.Job) => {
  await new ExpirationCompletePublisher(natsWrapper.client)
    .publish({
      orderId: job.data.orderId,
    });
});

export { expirationQueue };
