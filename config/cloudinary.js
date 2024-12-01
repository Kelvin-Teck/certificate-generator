const cloudinary = require("cloudinary");

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Additional check for undefined environment variables
// if (
//   !cloudinaryConfig.cloud_name ||
//   !cloudinaryConfig.api_key ||
//   !cloudinaryConfig.api_secret
// ) {
//   throw new Error(
//     "Missing required Cloudinary configuration environment variables."
//   );
// }

console.log(
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

cloudinary.v2.config(cloudinaryConfig);

module.exports = cloudinary;
