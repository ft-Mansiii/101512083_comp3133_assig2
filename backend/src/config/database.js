// Import mongoose for MongoDB connection
const mongoose = require("mongoose");

// Function to establish connection with MongoDB Atlas
async function connectDB() {
  try {
    // Connect using connection string from .env
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log(" DB:", mongoose.connection.name);
  } catch (err) {
    // If connection fails, log error and stop server
    console.error(" MongoDB error:", err.message);
    process.exit(1);
  }
}

// Export the connection function
module.exports = connectDB;
