const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  createWishlist,
  removeFromWishlist,
  myWishlist,
  getProductByCategory
} = require("../Controller/ProductCtrl");
const { isAuthenticatedUser, authorizeRoles } = require("../Middleware/auth");
const upload = require("../Middleware/fileupload");

const router = express.Router();

router.get("/",getAllProducts);

router.get("/by/category/:id", getProductByCategory);
router.post("/add/wishlist/:id", isAuthenticatedUser, createWishlist);
router.put("/remove/wishlist/:id",isAuthenticatedUser, removeFromWishlist);
router.get("/wishlist/me",isAuthenticatedUser, myWishlist);

router.get("/admin/products", getAdminProducts);

router.post("/admin/product/new",upload.array("image"),createProduct);

router.put("/admin/product/:id",isAuthenticatedUser, updateProduct)
router.delete("/admin/product/:id",isAuthenticatedUser, deleteProduct);

router.get("/:id",getProductDetails);

router.put("/review",isAuthenticatedUser, createProductReview);

router.get("/reviews",getProductReviews)
router.delete("/reviews",isAuthenticatedUser, deleteReview);

module.exports = router;

