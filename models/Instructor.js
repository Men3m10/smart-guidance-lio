const mongoose = require("mongoose");

const instructorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },

  subjectsCanTeach: [{ subName: String }],
  ssid_Hash: { type: String, required: true },
});
//exports.Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = mongoose.model("Instructor", instructorSchema);
