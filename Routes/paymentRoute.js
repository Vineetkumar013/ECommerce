const express = require("express");
const {
  processPayment,
  sendRazorpayApiKey,
} = require("../Controller/paymentCtrl");
const router = express.Router();
const { isAuthenticatedUser } = require("../Middleware/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/razorpayapikey").get(isAuthenticatedUser, sendRazorpayApiKey);

module.exports = router;
