// Import Cloudinary v2 API
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using environment variables
// These values are stored securely in the .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export configured Cloudinary instance
module.exports = cloudinary;
