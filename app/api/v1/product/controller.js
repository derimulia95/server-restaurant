const getAllProduct = async (req, res, next) => {
  try {
    res.send("Menampilkan product");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProduct,
};
