const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagsSchema = Schema({
  name: {
    type: String,
    minlength: [3, "Panjang nama tags minimal 3 karakter"],
    maxlength: [20, "panjang nama tags maximal 20 karakter"],
    required: [true, "Nama tags harus diisi"],
  },
});

module.exports = model("Tag", tagsSchema);
