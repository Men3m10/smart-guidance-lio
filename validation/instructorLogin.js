const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateInstructorLogin = (data) => {
  let errors = {};
  data.ssid_Hash = !isEmpty(data.ssid_Hash) ? data.ssid_Hash : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.ssid_Hash, { min: 14, max: 14 })) {
    errors.ssid_Hash = "ssid_Hash Number must be of 14 characters";
  }

  if (Validator.isEmpty(data.ssid_Hash)) {
    errors.ssid_Hash = "ssid_Hash Number field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateInstructorLogin;
