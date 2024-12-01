const XLSX = require("xlsx");
const { newError } = require("./response");
const cloudinary = require("./config/cloudinary");
const fetch = require("node-fetch"); // Import fetch for downloading the file
const { generateAndUploadCertificate, generateCertificates, uploadCertificateToCloudinary } = require("./utils");
const fs=  require('fs');
const { readFile } = require("fs/promises");
const Busboy = require('busboy')

const uploadCertificate = async (req) => {
  const data = req.body;
  const response = await generateCertificates(data);

  return response;
  // Upload to Cloudinary

  //   console.log(req.body);
  //   console.log("Buffer length:", req.body.length); // Should show a non-zero length

  //   try {
  //     if (!req.body || !Buffer.isBuffer(req.body)) {
  //       throw new Error("No file uploaded");
  //     }
  // console.log('why')
  //     // // Upload the Excel file to Cloudinary (streaming the file directly)
  //     const result = await new Promise((resolve, reject) => {
  //       const stream = cloudinary.uploader.upload_stream(
  //         {
  //           resource_type: "raw", // For raw files like Excel documents
  //           folder: "uploads",
  //         },
  //         (error, uploadedFile) => {
  //           if (error) {
  //            return reject(new Error("Failed to upload Excel file to Cloudinary"));
  //           }
  //           resolve(uploadedFile); // Resolves with the uploaded file data
  //         }
  //       );

  //       // Pipe the raw file data from the request to Cloudinary's upload stream
  //       stream.end(req.body);
  //     });
  //     console.log(result)

  //     // Fetch the uploaded file's URL from Cloudinary
  //     const fileUrl = result.secure_url;
  // console.log("File uploaded to Cloudinary:", fileUrl);
  // Download the file from Cloudinary for processing
  // const response = await fetch(fileUrl);
  // const fileBuffer = await response.buffer(); // Use buffer instead of arrayBuffer for Node.js

  // // Parse the Excel file using XLSX
  // const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  // const sheet = workbook.Sheets[workbook.SheetNames[0]];
  // const data = XLSX.utils.sheet_to_json(sheet);

  // const results = [];

  // // Loop through each row of data in the Excel sheet and process it
  // for (const { Name, Email, Course } of data) {
  //   try {
  //     // Generate and upload certificate (assuming this function is implemented elsewhere)
  //     const certUrl = await generateAndUploadCertificate(Name, Course);

  //     // Send email with the certificate URL (can be re-enabled when email logic is ready)
  //     // await transporter.sendMail({
  //     //   from: process.env.EMAIL_USER,
  //     //   to: Email,
  //     //   subject: "Your Certificate",
  //     //   text: `Dear ${Name},\n\nCongratulations on completing the ${Course} course! Your certificate is available here: ${certUrl}`,
  //     // });

  //     console.log(certUrl); // Log the generated certificate URL for now

  //     // Push the result to the response array
  //     results.push({ Name, Email, status: "Sent", certificateUrl: certUrl });
  //   } catch (error) {
  //     // In case of an error for a specific entry, push a failure status
  //     results.push({ Name, Email, status: "Failed", error: error.message });
  //   }
  // }

  // Return the processing results
  // return results;
  // } catch (error) {
  //   // Handle any errors during the process
  //   console.error(error.message);
  //   return newError("Error processing the file", 422);
  // }

  //  try {
  //    const busboy = Busboy({ headers: req.headers });
  //    const excelData = [];

  //    // Wrap busboy processing in a Promise
  //    await new Promise((resolve, reject) => {
  //      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
  //        const chunks = [];

  //        console.log(`Processing file: ${filename}, MIME type: ${mimetype}`);

  //        file.on("data", (chunk) => {
  //          chunks.push(chunk);
  //        });

  //        file.on("end", () => {
  //          try {
  //            const buffer = Buffer.concat(chunks);

  //            if (
  //              mimetype === "application/vnd.ms-excel" ||
  //              filename.endsWith(".csv")
  //            ) {
  //              // Handle CSV file
  //              const csvData = buffer.toString("utf-8");
  //              const rows = XLSX.utils.sheet_to_json(
  //                XLSX.read(csvData, { type: "string" }).Sheets.Sheet1
  //              );
  //              excelData.push(...rows);
  //            } else if (filename.endsWith(".xlsx")) {
  //              // Handle Excel file
  //              const workbook = XLSX.read(buffer, { type: "buffer" });
  //              const sheetName = workbook.SheetNames[0];
  //              const sheet = workbook.Sheets[sheetName];
  //              const rows = XLSX.utils.sheet_to_json(sheet);
  //              excelData.push(...rows);
  //            } else {
  //              reject(
  //                new Error(
  //                  "Unsupported file type. Please upload a CSV or Excel file."
  //                )
  //              );
  //            }
  //          } catch (error) {
  //            reject(error);
  //          }
  //        });

  //        file.on("error", (error) => {
  //          reject(error);
  //        });
  //      });

  //      busboy.on("finish", () => {
  //        resolve();
  //      });

  //      busboy.on("error", (error) => {
  //        reject(error);
  //      });

  //      req.pipe(busboy); // Pipe the incoming request to busboy
  //    });

  //    console.log("Processed Data:", excelData);

  //    // Here you can process `excelData` further (e.g., generate certificates)

  //    return {
  //      status: "success",
  //      message: "File processed successfully",
  //      data: excelData,
  //    };
  //  } catch (error) {
  //    console.error("Error processing file:", error);
  //    throw new Error("Failed to process the uploaded file");
  //  }
};

module.exports = {
  uploadCertificate,
};
