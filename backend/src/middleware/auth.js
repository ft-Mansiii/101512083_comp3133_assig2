// JWT authentication middleware
const jwt = require("jsonwebtoken");

// Verifies Authorization header and validates token
function requireAuth(req) {

  // Read Authorization header
  const header = req.headers.authorization || "";

  // Check if token exists and follows Bearer format
  if (!header.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing Bearer token");
  }

  const token = header.replace("Bearer ", "");

  try {
    // Verify token using secret from .env
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Token invalid or expired
    throw new Error("Unauthorized: Invalid/expired token");
  }
}

module.exports = { requireAuth };
