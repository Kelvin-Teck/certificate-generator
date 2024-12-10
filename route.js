const express = require("express");
const certificateController = require("./controller");
const { captureRawBinary } = require("./middleware");
const router = express.Router();

router.post(
  "/generate",
  certificateController.uploadCertificate
);

module.exports = router;
