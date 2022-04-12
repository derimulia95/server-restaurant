const router = require("express").Router();

const { showInvoice } = require("./controller");

router.get("/:order_id", showInvoice);

module.exports = router;
