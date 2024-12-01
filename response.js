

const sendError = (message, code) => {
  var error = {
    status: "ERROR",
    code: code,
    message: message,
  };

  return error;
};

const sendSuccess = (message, data = undefined) => {
  var success = {
    status: "SUCCESS",
    code: 200,
    message: message,
    data: data,
  };

  return success;
};

const newError = (message, code) => {
  const error = new Error(message);
  error.status = code;
  throw error;
};

module.exports = { sendError, newError, sendSuccess };
