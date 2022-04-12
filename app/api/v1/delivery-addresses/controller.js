const DeliveryAddress = require("./model");
const { policyFor } = require("../../../policy");
const { StatusCodes } = require("http-status-codes");
const { subject } = require("@casl/ability");

const storeAddress = async (req, res, next) => {
  let policy = policyFor(req.user);
  if (!policy.can("create", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    let payload = req.body;
    let user = req.user;

    let address = new DeliveryAddress({ ...payload, user: user._id });
    let result = await address.save();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  let policy = policyFor(req.user);

  try {
    let { id } = req.params;
    let { _id, ...payload } = req.body;

    let address = await DeliveryAddress.findOne({ _id: id });

    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });

    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to
        modify this resource`,
      });
    }

    address = await DeliveryAddress.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });

    res.status(StatusCodes.OK).json({ data: address });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  let policy = policyFor(req.user);

  try {
    let { id } = req.params;

    let address = await DeliveryAddress.findOne({ _id: id });

    let subjectAddress = subject({
      ...address,
      user: address.user,
    });

    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: `You're not allowed to
              delete this resource`,
      });
    }

    address = await DeliveryAddress.findOneAndDelete({ _id: id });
    res.status(StatusCodes.OK).json({ data: address });
  } catch (err) {
    next(err);
  }
};

const getAllAddress = async (req, res, next) => {
  const policy = policyFor(req.user);
  if (!policy.can("view", "DeliveryAddress")) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`,
    });
  }

  try {
    let { limit = 10, skip = 0 } = req.query;
    const count = await DeliveryAddress.find({
      user: req.user._id,
    }).countDocuments();

    const deliveryAddresses = await DeliveryAddress.find({ user: req.user._id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort("-createdAt");
    // (1) respon `data` dan `count`, `count` digunakan untuk pagination client
    return res.json({ data: deliveryAddresses, count: count });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  storeAddress,
  updateAddress,
  deleteAddress,
  getAllAddress,
};
