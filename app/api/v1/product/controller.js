const { StatusCodes } = require("http-status-codes");
const customAPI = require("../../../errors");
const Product = require("./model");
const Category = require("../categories/model");
const Tag = require("../tags/model");
const fs = require("fs");
const config = require("../../../config");

const storeProduct = async (req, res, next) => {
  try {
    let payload = req.body;

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    let result;

    if (!req.file) {
      result = new Product(payload);
    } else {
      result = new Product({ ...payload, image_url: req.file.filename });
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    let { limit = 10, skip = 0, q = "", category = "", tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (category.length) {
      category = await Category.findOne({
        name: { $regex: `${category}` },
        $options: "i",
      });

      if (category) {
        criteria = { ...criteria, category: category._id };
      }
    }

    if (tag.length) {
      tags = await Tag.find({ name: { $in: tags } });
      criteria = { ...criteria, tags: { $in: tags.map((tag) => tag._id) } };
    }

    const result = await Product.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("category")
      .populate("tags");

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const { id: produtId } = req.params;

    const result = await Product.findOne({ _id: produtId });

    if (!result) {
      throw new customAPI.NotFound("No speaker with id" + produtId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let payload = req.body;
    const { id: produtId } = req.params;

    const result = await Product.findOne({ _id: produtId });

    if (!result) {
      throw new customAPI.NotFound("No speaker with id" + produtId);
    }

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } });

      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      }
    }

    if (!req.file) {
      result.name = payload.name;
      result.description = payload.description;
      result.price = payload.price;
    } else {
      let currentImage = `${config.rootPath}/public${result.image_url}`;
      if (
        result.image_url !== "/uploads/default.jpg" &&
        fs.existsSync(currentImage)
      ) {
        fs.unlinkSync(currentImage);
      }
      result.name = payload.name;
      result.description = payload.description;
      result.price = payload.price;
      result.image_url = req.file.filename;
    }

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id: produtId } = req.params;

    const result = await Product.findOne({ _id: produtId });

    if (!result) {
      throw new customAPI.NotFound("No speaker with id" + produtId);
    }

    let currentImage = `${config.rootPath}/public${result.image_url}`;
    if (
      result.image_url !== "/uploads/default.jpg" &&
      fs.existsSync(currentImage)
    ) {
      fs.unlinkSync(currentImage);
    }

    await result.remove();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  storeProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
