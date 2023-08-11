import mongoose, { Schema } from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(_, ret): void {
      ret.id = ret._id;
      delete ret.__v;
      delete ret._id;
      delete ret.password;
    }
  }
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs): UserDoc => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
