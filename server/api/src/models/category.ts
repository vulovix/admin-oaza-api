import Mongoose from "mongoose";

const { Schema, model } = Mongoose;

const CategorySchema = new Schema({
  slug: String,
  name: String,
  createdAt: Number,
  modifiedAt: Number,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "account",
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "account",
  },
});

const CategoryModel = model("category", CategorySchema);

export default CategoryModel;
