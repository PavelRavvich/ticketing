import mongoose, { Schema } from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc: mongoose.Document, ret: Record<string, any>): void {
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => new Ticket(attrs);

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
