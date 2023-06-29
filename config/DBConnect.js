const mongoose = require('mongoose');
require("dotenv").config();

mongoose.set("strictQuery", true);

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas.");
  } catch (error) {
    console.error(
      "Error occurred while connecting to MongoDB Atlas...\n",
      error
    );
  }
};

module.exports = dbConnect;