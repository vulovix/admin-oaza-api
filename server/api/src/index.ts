import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";

import Config from "./config";
import AccountRoutes from "./routes/account";
import ArticleRoutes from "./routes/article";
import CategoryRoutes from "./routes/category";

const app = express();

const port = process.env.PORT || 5001;

mongoose.Promise = global.Promise;
mongoose
  .connect(Config.DB_STRING)
  .then(function () {
    console.log("API app, connected successfully.");
  })
  .catch(function (e) {
    console.log("API app, connecting failed.", e);
  });

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

app.use(cookieParser());

app.use("/api/accounts", AccountRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/articles", ArticleRoutes);
// app.use("/api/ai", openAIRoutes);
// app.use("/api/stream", streamRoutes);

if (import.meta.env.PROD) {
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}

export const EquilibriusAPI = app;
