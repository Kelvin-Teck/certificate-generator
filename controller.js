const { sendSuccess, sendError } = require("./response");
const certificateService = require('./service');

const uploadCertificate = async (req, res) => {
  try {
    const response = await certificateService.uploadCertificate(req);

    return res
      .status(200)
      .json(sendSuccess("Certificates successfuly sent", response));
  } catch (error) {
    return res.status(500).json(sendError(error.message, 500));
  }
};

module.exports = { uploadCertificate };
