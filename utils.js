const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./config/cloudinary");
const fs = require("fs");
const path = require("path");
const { sendCertificateEmail } = require("./mailers/mail");



async function generateAndUploadCertificate(name, course) {
  const canvas = createCanvas(1200, 800);
  const ctx = canvas.getContext("2d");

  // Load template
  const template = await loadImage("./templates/certificate_template.png");
  ctx.drawImage(template, 0, 0, 1200, 800);

  // Add text
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(name, 600, 400); // Adjust as per template
  ctx.fillText(course, 600, 500);

  // Convert to buffer and upload to Cloudinary
  const buffer = canvas.toBuffer("image/png");
  const result = await cloudinary.uploader
    .upload_stream({
      resource_type: "image",
      folder: "certificates",
      public_id: `${name}_certificate`,
    })
    .end(buffer);

  return result.secure_url;
}

const convertExcelToBase64 = async () => {
  // Read the Excel file as binary data
  const filePath = "./MOCK_DATA.xlsx"; // Path to your Excel file
  const fileBuffer = fs.readFileSync(filePath);

  // Convert binary data to a base64 string
  const base64String = fileBuffer.toString("base64");

  console.log(base64String);
  return base64String;
};

const generateCertificates = async (users) => {
  const templatePath = path.join(__dirname, "certificate_template.png"); // Path to the certificate template
  const outputDir = path.join(__dirname, "generated_certificates");

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    const templateImage = await loadImage(templatePath);

    for (const user of users) {
      const { name, role, email } = user;

      // Create a canvas with the same dimensions as the template
      const canvas = createCanvas(templateImage.width, templateImage.height);
      const context = canvas.getContext("2d");

      // Draw the template onto the canvas
      context.drawImage(templateImage, 0, 0);

      // Customize text styles
      context.font = "bold 150px Arial";
      context.fillStyle = "black";
      context.textAlign = "center";

      // Add user details to the certificate
      context.fillText(name, canvas.width / 2, 2000); // Name (adjust Y position as needed)
      context.font = "italic 100px Arial";
      context.fillText(role, 2000, 2270); // Role
      // context.fillText(email, canvas.width / 2, 500); // Email
      context.strokeStyle = "red";
      context.strokeRect(490, 330, 20, 20); // Small box around the intended text position

      // Save the generated certificate
      const outputPath = path.join(
        outputDir,
        `${name.replace(/ /g, "_")}_certificate.png`
      );
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      // Wait for the stream to finish
      await new Promise((resolve, reject) => {
        out.on("finish", resolve);
        out.on("error", reject);
      });

      console.log(`Certificate generated for ${name}: ${outputPath}`);
      // const certificateUrl = await uploadCertificateToCloudinary(outputPath);
      // console.log(`Uploaded to Cloudinary: ${certificateUrl}`);

      await sendCertificateEmail(user, outputPath)
    }

    return {
      status: "success",
      message: "Certificates generated successfully.",
    };
  } catch (error) {
    console.error("Error generating certificates:", error);
    throw new Error("Failed to generate certificates");
  }
};

// const uploadCertificateToCloudinary = (filePath) => {

//   return new Promise((resolve, reject) => {
//      const timeout = setTimeout(() => {
//       reject(new Error("Cloudinary upload timed out"));
//     }, 30000);
//     cloudinary.uploader.upload(
//       filePath,
//       { folder: "certificates" },
//       (error, result) => {
//         clearTimeout(timeout);
//         if (error) return reject(error);
//         resolve(result.secure_url); // Return the public URL of the uploaded file
//       }
//     );
//   });
// };


// const uploadCertificateToCloudinary = (filePath) => {
//   return new Promise((resolve, reject) => {
//     // Create a timeout
//     const timeout = setTimeout(() => {
//       reject(new Error("Cloudinary upload timed out"));
//     }, 30000); // 30 seconds timeout

//     // Use upload_stream for more reliable upload
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: "certificates",
//         resource_type: "image",
//       },
//       (error, result) => {
//         // Clear the timeout to prevent memory leaks
//         clearTimeout(timeout);

//         // Handle potential errors
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           return reject(error);
//         }

//         // Resolve with the secure URL
//         if (result && result.secure_url) {
//           resolve(result.secure_url);
//         } else {
//           reject(new Error("No secure URL returned from Cloudinary"));
//         }
//       }
//     );

//     // Create a read stream and pipe it to the upload stream
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(uploadStream);

//     // Handle file stream errors
//     fileStream.on("error", (err) => {
//       clearTimeout(timeout);
//       reject(err);
//     });
//   });
// };

const uploadCertificateToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    // Increase timeout to 60 seconds
    const timeout = setTimeout(() => {
      console.error(`Upload timeout for file: ${filePath}`);
      reject(new Error("Cloudinary upload timed out"));
    }, 60000); // 60 seconds timeout

    // Verify file exists before uploading
    if (!fs.existsSync(filePath)) {
      clearTimeout(timeout);
      return reject(new Error(`File not found: ${filePath}`));
    }

    // Get file stats to check file size
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      clearTimeout(timeout);
      return reject(new Error(`File is empty: ${filePath}`));
    }

    // Use upload method with comprehensive error handling
    cloudinary.uploader.upload(
      filePath,
      {
        folder: "certificates",
        resource_type: "image",
      },
      (error, result) => {
        // Clear the timeout immediately
        clearTimeout(timeout);

        // Detailed error handling
        if (error) {
          console.error("Detailed Cloudinary upload error:", {
            errorCode: error.code,
            errorMessage: error.message,
            filePath: filePath,
          });
          return reject(error);
        }

        // Verify result
        if (!result || !result.secure_url) {
          console.error("No secure URL returned from Cloudinary", { result });
          return reject(new Error("No secure URL from Cloudinary"));
        }

        // Successfully uploaded
        console.log(`Successfully uploaded certificate for: ${filePath}`);
        resolve(result.secure_url);
      }
    );
  });
};

module.exports = {
  generateAndUploadCertificate,
  convertExcelToBase64,
  generateCertificates,
  uploadCertificateToCloudinary,
};
