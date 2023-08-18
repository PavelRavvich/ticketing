import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@pravvich-tickets/common";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

export interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema: Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
}, {
  toJSON: {
    transform(doc: mongoose.Document, ret: Record<string, any>): void {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs): OrderDoc => new Order({
  _id: attrs.id,
  price: attrs.price,
  status: attrs.status,
  userId: attrs.userId,
  version: attrs.version
});

const Order: OrderModel = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
