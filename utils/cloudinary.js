const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.uploadFile = (file, folder) => {
  const fileStream = fs.createReadStream(file.path);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileStream.path,
      {
        folder: "/inventory-app/" + folder,
        allowed_formats: ["jpg", "jpeg", "png"],
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

exports.deleteFile = async (file) => {
  await cloudinary.uploader.destroy(file);
};
