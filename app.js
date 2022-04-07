const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const productRouter = require("./app/api/v1/product/router");

const app = express();

const vertionV1 = "/api/v1";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(`${vertionV1}/product`, productRouter);

app.use("/", (req, res) => {
  res.json({ message: "welcome to api express" });
});

module.exports = app;
