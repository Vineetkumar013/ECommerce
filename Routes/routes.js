const router = require("express").Router();

router.use("/user", require("./userRoute"));
router.use("/product", require("./productRoute"));
router.use("/catg", require("./categoryRoute"));
router.use("/cart", require("./cartRoute"));
router.use("/order", require("./ShoppingCartOrderRoute"));
router.use("/help", require("./helpandSupportRoute"));
router.use("/banner", require("./bannerRoute"));
router.use("/term", require("./termRoute"));
router.use("/privacy&policy", require("./termRoute"));
router.use("/verdor", require("./VendorRoute"));
router.use("/driver", require("./DriverRoute"));
router.use("/notify", require("./notificationRoute"));
router.use("/coupon", require("./couponRoute"));
router.use("/aboutUs", require("./aboutusRoute"));
router.use("/faqs", require("./faqRoute"));
router.use("/wallet", require("./myWalletRoute"));
router.use("/schedule", require("./myScheduleRoute"));

module.exports = router;