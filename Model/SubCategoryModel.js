const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  subCategory: {
    type: String,
    required: [true, "Parent Category Required"],
    unique:true
  },
  image: {  
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
});

module.exports = mongoose.model("SubCategory", subCategorySchema);