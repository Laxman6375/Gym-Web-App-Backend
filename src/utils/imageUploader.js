
const cloudinary = require('../config/cloudinary'); // Import the Cloudinary configuration

exports.uploadImageToCloudinary = async (fileBuffer, folder, height, quality) => {
  const options = {
    folder,
    resource_type: 'auto', // Automatically detect file type
  };

  if (height) options.height = height;
  if (quality) options.quality = quality;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
    uploadStream.end(fileBuffer); // Send the file buffer to Cloudinary
  });
};
