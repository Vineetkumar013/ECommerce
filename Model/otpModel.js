const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  otp: {
    type: String,
    required: true,
  },
  expires: {
    type: Number,
    default: function(){
      return Date.now() + 1000 * 60 * 15
    }
  },
  type: {
    type: String,
    enum: ["account_verification", "password_reset"]
  }
});

module.exports = mongoose.model("OTP", otpSchema);
