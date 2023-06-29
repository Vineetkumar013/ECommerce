const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  phone: {
    type: Number,
    unique: true,
    required: [false, "Please Enter Your Mobile Number"],
    
  },
  // Wallet: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref:"Wallet",
  // },
  email: {
    type: String,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  // password: {
  //   type: String,
  //   required: [false, "Please Enter Your Password"],
  //   minLength: [8, "Password should be greater than 8 characters"],
  //   default: "",
  //   select: false,
  // },
  gender: {
    type: String,
    enum: ["male", "female"],
    defaultValue: "male",
  },
  profile:{
    type:String
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    // default: "user",
  },
  phone: {
    type: Number,
    require: false
  }, 
  otp: {
    type: String
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Number,
});

module.exports = mongoose.model("User", userSchema);
