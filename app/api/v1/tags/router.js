const express = require("express");
const router = express.Router();
const tagController = require("./controller");
const upload = require("../../../middlewares/multer");

router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getOneTag);
router.post("/", upload.none(), tagController.storeTags);
router.put("/:id", upload.none(), tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
