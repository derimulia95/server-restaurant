const router = require("express").Router();

const upload = require("../../../middlewares/multer");
const { addToCart, getCart } = require("./controller");

router.put("/", upload.none(), addToCart);
// (3) route untuk `update` cart
router.get("/", getCart);

module.exports = router;
