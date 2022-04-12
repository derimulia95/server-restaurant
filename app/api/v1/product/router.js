const express = require("express");
const router = express.Router();
const upload = require("../../../middlewares/multer");

const productController = require("./controller");

/* GET users listing. */
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getOneProduct);
router.post("/", upload.single("image_url"), productController.storeProduct);
router.put("/:id", upload.single("image_url"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
