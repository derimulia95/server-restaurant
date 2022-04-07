var express = require("express");
var router = express.Router();

const productController = require("./controller");

/* GET users listing. */
router.get("/", productController.getAllProduct);

module.exports = router;
