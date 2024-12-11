// const uploadCertificateToCloudinary = async (imagePath) => {
//   try {
//     const certificateImage = await cloudinary.uploader.upload(imagePath, {
//       folder: "certificates", // Specify the folder in Cloudinary
//       width: 300, // Resize width to 300
//       crop: "scale", // Apply scaling crop
//     });

//     // Return the Cloudinary response
//     const response = {
//       public_id: certificateImage.public_id,
//       url: certificateImage.secure_url,
//     };

//     return response;
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error;
//   }
// };

// module.exports = {
//   uploadCertificateToCloudinary,
// };
