const {
  addToCart,
  getCart,
  updateQuantity,
  applyCoupon
} = require("../Controller/cartCtrl");

const router = require("express").Router();

router.post("/:id", addToCart);
router.put("/:id", updateQuantity);
router.get("/:id", getCart);
router.put("/coupon", applyCoupon);

module.exports = router;  