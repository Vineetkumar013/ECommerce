const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    percentage: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  });
  

const Discount = mongoose.model('Discount', discountSchema);


module.exports = Discount