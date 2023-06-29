const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./config/DBConnect");
require("dotenv").config();

// Connect to the database
dbConnect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/v1", require("./Routes/routes"));


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
