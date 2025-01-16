const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "djwzctllj",
  api_key: "242458743397523",
  api_secret: "-9S2cRF7iP0t4axsBl6lC4io_Fw",
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage }).single("image");
const uploadMultiple = multer({ storage }).array("images", 100); // Allows up to 100 images

module.exports = { upload, uploadMultiple };
