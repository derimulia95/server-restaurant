const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../users/model");
const { StatusCodes, RESET_CONTENT } = require("http-status-codes");
const { secretKey } = require("../../../config");
const { getToken } = require("../../../utils/get-token");

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

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done();

    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);

    if (!user) {
      return res.json({ error: 1, message: "email or password incorect" });
    }
    let signed = jwt.sign(user, secretKey);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    return res.status(StatusCodes.OK).json({
      message: "logged in successfully",
      user: user,
      token: signed,
    });
  });
};

const me = async (req, res, next) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Your're not login or token expired`,
    });
  }
  return res.json(req.user);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!user || !token) {
    return res.json({
      error: 1,
      message: "User tidak ditemukan",
    });
  }

  return res.json({
    error: 0,
    message: "Logout Berhasil",
  });
};

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
};
