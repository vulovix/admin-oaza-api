import Mongoose from "mongoose";

const { Schema, model } = Mongoose;

const AccountSchema = new Schema({
  email: String,
  lastName: String,
  firstName: String,
  password: String,
  createdAt: Number,
  modifiedAt: Number,
  emailConfirmed: Boolean,
});

const AccountModel = model("account", AccountSchema);

export default AccountModel;
