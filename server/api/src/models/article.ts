import Mongoose from "mongoose";

const { Schema, model } = Mongoose;

const ArticleSchema = new Schema({
  slug: String,
  image: String,
  title: String,
  public: Boolean,
  subtitle: String,
  description: String,
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
  ],
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

const ArticleModel = model("article", ArticleSchema);

export default ArticleModel;
