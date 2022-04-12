const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const productRouter = require("./app/api/v1/product/router");
const categoryRouter = require("./app/api/v1/categories/router");
const tagRouter = require("./app/api/v1/tags/router");
const userRouter = require("./app/api/v1/users/router");

const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handler-error");

const app = express();

const vertionV1 = "/api/v1";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(`${vertionV1}/product`, productRouter);
app.use(`${vertionV1}/category`, categoryRouter);
app.use(`${vertionV1}/tag`, tagRouter);
app.use(`${vertionV1}/user`, userRouter);

app.use("/", (req, res) => {
  res.json({ message: "welcome to api express" });
});

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
