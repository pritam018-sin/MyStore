import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      throw new Error("No file path provided or file does not exist");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "my-app",
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (unlinkErr) {
        console.error("Error deleting local temp file:", unlinkErr);
      }
    }
    console.error("Cloudinary upload failed:", error.message);
    return null;
  }
};

export { cloudinaryUpload };