const { StatusCodes } = require("http-status-codes");
const User = require("./model");

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    let user = new User(payload);

    let result = await user.save();
    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
};
