const router = require("express").Router();

const {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getDesa,
} = require("./controller");

router.get("/provinsi", getProvinsi);
router.get("/kabupaten", getKabupaten);
router.get("/kecamatan", getKecamatan);
router.get("/desa", getDesa);

module.exports = router;
