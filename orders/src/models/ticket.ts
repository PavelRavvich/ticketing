import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@pravvich-tickets/common";
import { Order } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByIdAndPreviousVersion(event: {
    id: string,
    version: number
  }): Promise<TicketDoc | null>;
}


const ticketSchema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc: mongoose.Document, ret: Record<string, any>): void {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByIdAndPreviousVersion = (event: { id: string, version: number }): Promise<TicketDoc | null> =>
  Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => new Ticket({
  _id: attrs.id,
  title: attrs.title,
  price: attrs.price,
});

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  return !!existingOrder;
}

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
