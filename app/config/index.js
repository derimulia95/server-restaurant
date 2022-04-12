const dotenv = require("dotenv");
dotenv.config();

const path = require("path");

module.exports = {
  rootPath: path.resolve(__dirname, "../../"),
  urlDB: process.env.MONGODB_URL_DEV,
  secretKey: process.env.SECRET_KEY,
};
