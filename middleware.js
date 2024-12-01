const express = require("express");

// Middleware to capture raw binary data (for Excel file uploads)
const captureRawBinary = express.raw({ type: "application/vnd.ms-excel" });

// Wrapper to add error handling and logging
const middlewareWrapper = (req, res, next) => {
  captureRawBinary(req, res, (err) => {
    if (err) {
      // Handle errors in case the content-type doesn't match
      return res
        .status(400)
        .json({ error: "Invalid file type or no file provided" });
    }

    // console.log("Received raw data:", req.body); // This will log the buffered data
    next(); // Pass the request to the next middleware or controller
  });
};

module.exports = { captureRawBinary: middlewareWrapper };
