const res = require("express/lib/response");
const { StatusCodes } = require("http-status-codes");
const { policyFor } = require("../../../policy");
const Product = require("../product/model");
const CartItem = require("./model");

const addToCart = async (req, res, next) => {
  let policy = policyFor(req.user);
  if (!policy.can("update", "Cart")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }
  try {
    const { items } = req.body;
    const productIds = items.map((itm) => itm.product._id);
    const products = await Product.find({ _id: { $in: productIds } });
    let cartItems = items.map((item) => {
      let relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );
      return {
        _id: relatedProduct._id,
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,

        user: req.user._id,
        qty: item.qty,
      };
    });
    await CartItem.deleteMany({ user: req.user.id });
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: { user: req.user._id, product: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );
    return res.status(StatusCodes.OK).json({ data: cartItems });
  } catch (err) {
    // (1) tangani kemungkinan _error_
    next(err);
  }
};

const getCart = async (req, res, next) => {
  let policy = policyFor(req.user);
  if (!policy.can("read", "Cart")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }
  try {
    let items = await CartItem.find({ user: req.user._id }).populate("product");
    return res.status(StatusCodes.OK).json({ data: items });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addToCart,
  getCart,
};
