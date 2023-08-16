import { Listener, Subjects, TicketUpdatedEvent } from "@pravvich-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
    const { id, version, title, price } = data;
    const ticket = await Ticket.findByIdAndPreviousVersion({ id, version });

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
