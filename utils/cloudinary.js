const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.uploadFile = async (file, folder) => {
  const fileStream = fs.createReadStream(file.path);
  await cloudinary.uploader.upload(
    fileStream.path,
    {
      folder: "/inventory-app/" + folder,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log(result);
      return result;
    }
  );
};
