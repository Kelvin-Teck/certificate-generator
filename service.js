const XLSX = require("xlsx");
const { newError } = require("./response");
const cloudinary = require("./config/cloudinary");
const fetch = require("node-fetch"); // Import fetch for downloading the file
const {
  generateAndUploadCertificate,
  generateSingleCertificate,
  uploadCertificateToCloudinary,
  generateCertificates,
} = require("./utils");
const fs = require("fs");
const { readFile } = require("fs/promises");
const Busboy = require("busboy");


const uploadCertificate = async (req) => {
  const data = req.body;
  const response = await generateCertificates(data);

  return response;
};

module.exports = {
  uploadCertificate,
};
