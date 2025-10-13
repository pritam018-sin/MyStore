import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.LOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Configure multer to use memory storage (for uploading directly to Cloudinary)
const storage = multer.memoryStorage(); // Store in memory before sending to Cloudinary

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (req.file) {
      // Upload to Cloudinary
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image", // For image uploads
        },
        (error, result) => {
          if (error) {
            return res.status(500).send({ message: error.message });
          }
          // Send the Cloudinary URL of the uploaded image
          res.status(200).send({
            message: "Image uploaded successfully",
            image: result.secure_url, // This is the Cloudinary URL
          });
        }
      ).end(req.file.buffer); // Send file buffer to Cloudinary
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
