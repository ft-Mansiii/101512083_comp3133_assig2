// Employee schema definition
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Basic employee information
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },

    // Email must be unique
    email: { type: String, required: true, unique: true },

    // Restrict gender to predefined values
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    designation: { type: String, required: true },

    // Salary must be >= 1000
    salary: { type: Number, required: true, min: 1000 },

    date_of_joining: { type: Date, required: true },

    department: { type: String, required: true },

    // Stores Cloudinary image URL
    employee_photo: { type: String }
  },
  {
    // Automatically manage created_at and updated_at
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
