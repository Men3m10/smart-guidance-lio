const mongoose = require("mongoose");

const studentsSchema = mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  uni_email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  department: { type: String, required: true },
  GPA: { type: Number, required: true },
  elsho3ba: { type: String, default: "" },
  sex: { type: String, required: true },
  code_Hash: { type: String, required: true },
  ssid_Hash: { type: String, required: true },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
    },
  ],
  section: { type: String, required: true },
});

//exports.Students = mongoose.model("Students", studentsSchema);
module.exports = mongoose.model("Students", studentsSchema);
