const router = require("express").Router();
const upload = require("../../../middlewares/multer");
// (2) import `orderController`
const { CreateOrder, getOrder } = require("./controller");
// (3) _route_ untuk membuat `order`
router.post("/", upload.none(), CreateOrder);
router.get("/", upload.none(), getOrder);
// (4) export `router`
module.exports = router;
