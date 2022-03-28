const mongoose = require("mongoose");

const Subjectsschema = mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  totalLectures: {
    type: Number,
    default: 12,
  },
  year: {
    type: String,
    required: true,
  },
  attendence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attendence",
  },
});

//exports.Subjects = mongoose.model("Subjects", Subjectsschema);
module.exports = mongoose.model("Subjects", Subjectsschema);
