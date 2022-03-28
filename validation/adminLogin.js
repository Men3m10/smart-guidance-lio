const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateAdminLogin = (data) => {
  let errors = {};
  data.ssid_Hash = !isEmpty(data.ssid_Hash) ? data.ssid_Hash : "";
  data.password_hash = !isEmpty(data.password_hash) ? data.password_hash : "";

  if (!Validator.isLength(data.ssid_Hash, { min: 14, max: 14 })) {
    errors.ssid_Hash = "SSID Number must be of 14 characters";
  }

  if (Validator.isEmpty(data.ssid_Hash)) {
    errors.ssid_Hash = "SSID Number field is required";
  }

  if (Validator.isEmpty(data.password_hash)) {
    errors.password_hash = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateAdminLogin;
