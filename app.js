const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const productRouter = require("./app/api/v1/product/router");
const categoryRouter = require("./app/api/v1/categories/router");
const tagRouter = require("./app/api/v1/tags/router");
const userRouter = require("./app/api/v1/auth/router");
const wilayahRouter = require("./app/api/v1/wilayah/router");
const addressRouter = require("./app/api/v1/delivery-addresses/router");
const cartsRouter = require("./app/api/v1/cart-item/router");
const orderRouter = require("./app/api/v1/order/router");
const invoiceRouter = require("./app/api/v1/invoice/router");

const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handler-error");
const { decodeToken } = require("./app/middlewares/auth");

const app = express();

const vertionV1 = "/api/v1";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(decodeToken);

app.use(`${vertionV1}/product`, productRouter);
app.use(`${vertionV1}/category`, categoryRouter);
app.use(`${vertionV1}/tag`, tagRouter);
app.use(`${vertionV1}/user`, userRouter);
app.use(`${vertionV1}/wilayah`, wilayahRouter);
app.use(`${vertionV1}/delivery-adresss`, addressRouter);
app.use(`${vertionV1}/carts`, cartsRouter);
app.use(`${vertionV1}/order`, orderRouter);
app.use(`${vertionV1}/invoice`, invoiceRouter);

app.use("/", (req, res) => {
  res.json({ message: "welcome to api express" });
});

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
