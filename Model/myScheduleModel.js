const mongoose = require('mongoose');

// Create the model schema
const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  date: {
    type: Date
  },
  product: {
    type: mongoose.Schema.Types.ObjectId
  }
});

// Save the model schema
module.exports = mongoose.model('Schedule', scheduleSchema);
                           