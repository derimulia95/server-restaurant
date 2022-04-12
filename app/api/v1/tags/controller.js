const { StatusCodes } = require("http-status-codes");
const Tag = require("./model");
const customAPI = require("../../../errors");

const getAllTags = async (req, res, next) => {
  try {
    let result = await Tag.find();

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const storeTags = async (req, res, next) => {
  try {
    //--- cek policy ---/
    let policy = policyFor(req.user);
    if (!policy.can("create", "tag")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk create tag`,
      });
    }
    //-----------------//
    let payload = req.body;

    let result = new Tag(payload);

    await result.save();

    res.status(StatusCodes.CREATED).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const getOneTag = async (req, res, next) => {
  try {
    const { id: tagId } = req.params;
    let result = await Tag.findOne({ _id: tagId });

    if (!result) {
      throw new customAPI.NotFound("No categori with id" + tagId);
    }

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const updateTag = async (req, res, next) => {
  try {
    //--- cek policy ---/
    let policy = policyFor(req.user);
    if (!policy.can("update", "tag")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk update tag`,
      });
    }
    let payload = req.body;
    const { id: tagId } = req.params;

    let result = await Tag.findOneAndUpdate({ _id: tagId }, payload, {
      new: true,
      runValidators: true,
    });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("delete", "tag")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk delete tag`,
      });
    }
    const { id: tagId } = req.params;

    let result = await Tag.findOneAndDelete({ _id: tagId });

    res.status(StatusCodes.OK).json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTags,
  getOneTag,
  storeTags,
  updateTag,
  deleteTag,
};
