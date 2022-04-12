const router = require("express").Router();
const upload = require("../../../middlewares/multer");

const {
  storeAddress,
  updateAddress,
  deleteAddress,
  getAllAddress,
} = require("./controller");

router.post("/", upload.none(), storeAddress);
router.put("/:id", upload.none(), updateAddress);
router.delete("/:id", deleteAddress);
router.get("/", getAllAddress);

module.exports = router;
