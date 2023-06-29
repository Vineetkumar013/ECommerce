const { isAuthenticatedUser, authorizeRoles } = require("../Middleware/auth");
const router = require("express").Router();
const couponController = require("../Controller/couponCtrl");

router.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  couponController.createCoupon
);

router.get(
  "/all",
  couponController.getAllCoupons
);

router.get("/", isAuthenticatedUser, couponController.getActiveCoupons);

router.delete(
  "/:couponId",
  couponController.deleteCoupon
);

module.exports = router;
