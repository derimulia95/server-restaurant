const { StatusCodes } = require("http-status-codes");
const Category = require("./model");
const customAPI = require("../../../errors");
const { policyFor } = require("../../../policy");

const getAllCategory = async (req, res, next) => {
  try {
    let result = await Category.find();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const storeCategory = async (req, res, next) => {
  try {
    //--- cek policy ---/
    let policy = policyFor(req.user);
    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk membuat category`,
      });
    }
    //-----------------//
    let payload = req.body;

    let result = new Category(payload);

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneCategory = async (req, res, next) => {
  try {
    const { id: categoryId } = req.params;
    let result = await Category.findOne({ _id: categoryId });

    if (!result) {
      throw new customAPI.NotFound("No categori with id" + categoryId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    //--- cek policy ---/
    let policy = policyFor(req.user);
    if (!policy.can("update", "Category")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk update category`,
      });
    }
    //-----------------//
    let payload = req.body;
    const { id: categoryId } = req.params;

    let result = await Category.findOneAndUpdate({ _id: categoryId }, payload, {
      new: true,
      runValidators: true,
    });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    //--- cek policy ---/
    let policy = policyFor(req.user);
    if (!policy.can("delete", "Category")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk mengahapus category`,
      });
    }
    //-----------------//
    const { id: categoryId } = req.params;

    let result = await Category.findOneAndDelete({ _id: categoryId });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategory,
  storeCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
