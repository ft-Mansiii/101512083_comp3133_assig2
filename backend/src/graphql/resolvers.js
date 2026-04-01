// Auth + Employee resolvers (GraphQL)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User");
const Employee = require("../models/Employee");

// Cloudinary upload helper + JWT middleware
const cloudinary = require("../config/cloudinary");
const { requireAuth } = require("../middleware/auth");

// Simple email check
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Create JWT token for a user
function makeToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

// If employee_photo is base64 -> upload to Cloudinary
// Otherwise return the value as-is (URL/path)
async function resolveEmployeePhoto(employee_photo) {
  if (!employee_photo) return null;

  const isBase64 = employee_photo.startsWith("data:image/");
  if (!isBase64) return employee_photo;

  const result = await cloudinary.uploader.upload(employee_photo, {
    folder: "comp3133_employees",
    resource_type: "image",
  });

  return result.secure_url;
}

// Basic validation for required employee fields
function validateEmployeeInput(input) {
  const required = [
    "first_name",
    "last_name",
    "email",
    "gender",
    "designation",
    "salary",
    "date_of_joining",
    "department",
  ];

  for (const f of required) {
    if (input[f] === undefined || input[f] === null || input[f] === "") {
      return `${f} is required`;
    }
  }

  if (!isEmail(input.email)) return "Invalid email";
  if (!["Male", "Female", "Other"].includes(input.gender))
    return "gender must be Male/Female/Other";
  if (Number(input.salary) < 1000) return "salary must be >= 1000";

  return null;
}

const resolvers = {
  // ---------------- AUTH ----------------

  // Create new user account
  signup: async ({ input }) => {
    try {
      const { username, email, password } = input;

      // Required checks
      if (!username || !email || !password) {
        return {
          success: false,
          message: "username, email, password are required",
          token: null,
          user: null,
        };
      }

      // Format checks
      if (!isEmail(email)) {
        return { success: false, message: "Invalid email format", token: null, user: null };
      }
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters", token: null, user: null };
      }

      // Check duplicates (username/email)
      const exists = await User.findOne({ $or: [{ username }, { email }] });
      if (exists) {
        return { success: false, message: "Username or email already exists", token: null, user: null };
      }

      // Hash password and save user
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed });

      // Token for session
      const token = makeToken(user);

      return { success: true, message: "Signup successful", token, user };
    } catch (err) {
      if (err.code === 11000) {
        return { success: false, message: "Username or email already exists", token: null, user: null };
      }
      return { success: false, message: err.message, token: null, user: null };
    }
  },

  // Login with username OR email + password
  login: async ({ input }) => {
    try {
      const { usernameOrEmail, password } = input;

      if (!usernameOrEmail || !password) {
        return { success: false, message: "usernameOrEmail and password are required", token: null, user: null };
      }

      // Find by email if it looks like email, else username
      const user = await User.findOne(
        isEmail(usernameOrEmail) ? { email: usernameOrEmail } : { username: usernameOrEmail }
      );

      if (!user) return { success: false, message: "Invalid credentials", token: null, user: null };

      // Compare password hash
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return { success: false, message: "Invalid credentials", token: null, user: null };

      const token = makeToken(user);
      return { success: true, message: "Login successful", token, user };
    } catch (err) {
      return { success: false, message: err.message, token: null, user: null };
    }
  },

  // ---------------- EMPLOYEES (JWT Protected) ----------------

  // Get all employees
  getAllEmployees: async (args, context) => {
    try {
      requireAuth(context.req);

      const employees = await Employee.find().sort({ created_at: -1 });
      return { success: true, message: "Employees fetched successfully", employees };
    } catch (err) {
      return { success: false, message: err.message, employees: [] };
    }
  },

  // Find one employee by Mongo _id (eid)
  searchEmployeeByEid: async ({ eid }, context) => {
    try {
      requireAuth(context.req);

      const employee = await Employee.findById(eid);
      if (!employee) return { success: false, message: "Employee not found", employee: null };

      return { success: true, message: "Employee found", employee };
    } catch (err) {
      return { success: false, message: err.message, employee: null };
    }
  },

  // Filter employees by designation and/or department
  searchEmployeeByDesignationOrDepartment: async ({ designation, department }, context) => {
    try {
      requireAuth(context.req);

      if (!designation && !department) {
        return { success: false, message: "Provide designation or department", employees: [] };
      }

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      const employees = await Employee.find(filter).sort({ created_at: -1 });
      return { success: true, message: "Employees fetched successfully", employees };
    } catch (err) {
      return { success: false, message: err.message, employees: [] };
    }
  },

  // Create employee (photo can be URL or base64)
  addEmployee: async ({ input }, context) => {
    try {
      requireAuth(context.req);

      const msg = validateEmployeeInput(input);
      if (msg) return { success: false, message: msg, employee: null };

      const photoUrl = await resolveEmployeePhoto(input.employee_photo);

      const employee = await Employee.create({
        ...input,
        employee_photo: photoUrl || null,
        date_of_joining: new Date(input.date_of_joining),
      });

      return { success: true, message: "Employee created successfully", employee };
    } catch (err) {
      if (err.code === 11000) {
        return { success: false, message: "Employee email must be unique", employee: null };
      }
      return { success: false, message: err.message, employee: null };
    }
  },

  // Update employee by id (only validate fields if provided)
  updateEmployeeByEid: async ({ eid, input }, context) => {
    try {
      requireAuth(context.req);

      // Optional field validation
      if (input.email && !isEmail(input.email)) {
        return { success: false, message: "Invalid email", employee: null };
      }
      if (input.gender && !["Male", "Female", "Other"].includes(input.gender)) {
        return { success: false, message: "gender must be Male/Female/Other", employee: null };
      }
      if (input.salary !== undefined && Number(input.salary) < 1000) {
        return { success: false, message: "salary must be >= 1000", employee: null };
      }

      const updateDoc = { ...input };

      // Upload new photo if sent as base64
      if (input.employee_photo) {
        updateDoc.employee_photo = await resolveEmployeePhoto(input.employee_photo);
      }

      // Convert date string to Date
      if (input.date_of_joining) {
        updateDoc.date_of_joining = new Date(input.date_of_joining);
      }

      const employee = await Employee.findByIdAndUpdate(
        eid,
        { $set: updateDoc },
        { new: true, runValidators: true }
      );

      if (!employee) return { success: false, message: "Employee not found", employee: null };

      return { success: true, message: "Employee updated successfully", employee };
    } catch (err) {
      if (err.code === 11000) {
        return { success: false, message: "Employee email must be unique", employee: null };
      }
      return { success: false, message: err.message, employee: null };
    }
  },

  // Delete employee by id
  deleteEmployeeByEid: async ({ eid }, context) => {
    try {
      requireAuth(context.req);

      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) return { success: false, message: "Employee not found", employee: null };

      return { success: true, message: "Employee deleted successfully", employee };
    } catch (err) {
      return { success: false, message: err.message, employee: null };
    }
  },
};

module.exports = { resolvers };
