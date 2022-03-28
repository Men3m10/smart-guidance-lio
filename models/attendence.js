const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendenceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Students",
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subjects",
  },
  totalLecturesByinstructor: {
    type: Number,
    default: 0,
  },
  lectureAttended: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("attendence", attendenceSchema);
