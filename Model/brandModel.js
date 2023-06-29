const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brandIcon: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  brandName: {
    type: String,
    unique: true,
    required: [true, "Please Enter Brand Name !"],
  },
  brandStatus: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
