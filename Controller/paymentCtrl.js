 const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const Razorpay = require("razorpay");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env. RAZORPAY_API_KEY,
    key_secret: process.env. RAZORPAY_SECRET_KEY,
  });

  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
  };

  await instance.orders.create(options, (err, order) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }
    res.status(200).json({ success: true, order });
  });
});

exports.sendRazorpayApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ razorpayApiKey: process.env.RAZORPAY_API_KEY });
});
