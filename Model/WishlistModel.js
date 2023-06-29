const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  products: {
    type: [mongoose.Types.ObjectId],
    ref: "Product"
  }
});

module.exports = mongoose.model("Wishlist", wishlistSchema);