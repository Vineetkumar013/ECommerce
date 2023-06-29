const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "address required"],
  },
  city: {
    type: String,
    required: [true, "City is must"],
  },
  state: {
    type: String,
    required: [true, "State Must"],
  },
  pinCode: {
    type: Number,
    required: [true, "Pincode Required"],
  },
  landMark: {
    type: String,
  },
  street: {
    type: String,
    required: [true, "Street must"],
  },
  user: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Address", addressSchema);
