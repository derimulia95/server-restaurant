const router = require("express").Router();
const upload = require("../../../middlewares/multer");

const { register } = require("./controller");

router.post("/register", upload.none(), register);

module.exports = router;
