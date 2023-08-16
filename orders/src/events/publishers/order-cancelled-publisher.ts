import { Publisher, OrderCancelledEvent, Subjects } from '@pravvich-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
