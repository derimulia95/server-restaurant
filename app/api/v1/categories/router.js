const express = require("express");
const router = express.Router();
const categoryController = require("./controller");
const upload = require("../../../middlewares/multer");

router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getOneCategory);
router.post("/", upload.none(), categoryController.storeCategory);
router.put("/:id", upload.none(), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
