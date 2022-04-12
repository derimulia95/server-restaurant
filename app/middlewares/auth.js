const { getToken } = require("../utils/get-token");
const { secretKey } = require("../config");
const jwt = require("jsonwebtoken");
const User = require("../api/v1/users/model");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);
      if (!token) return next();

      req.user = jwt.verify(token, secretKey);

      let user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res.json({
          error: 1,
          message: "Token expired",
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  decodeToken,
};
