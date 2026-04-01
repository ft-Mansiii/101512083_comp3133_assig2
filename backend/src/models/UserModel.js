// User schema definition
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Username acts like primary identifier
    username: { type: String, required: true, unique: true },

    // Email must also be unique
    email: { type: String, required: true, unique: true },

    // Password will be stored as hashed value
    password: { type: String, required: true }
  },
  {
    // Automatically adds created_at and updated_at fields
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("User", userSchema);
