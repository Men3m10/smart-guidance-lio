const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/key");

///////////////////////////////////////////////////////////////////////////////

const Student = require("../models/Students");
const Subject = require("../models/Subjects");
const Mark = require("../models/marks");
const Instructor = require("../models/Instructor");
const Attendence = require("../models/attendence");

////////////////////// Validation //////////////////////////////////////////////////////////

const validateInstructorLogin = require("../validation/instructorLogin");
const validateFetchStudentsInput = require("../validation/instructorFetchStudents");
const validateFacultyUploadMarks = require("../validation/instructorUploadMarkes");
///////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  instructorLogin: async (req, res) => {
    try {
      const { errors, isValid } = validateInstructorLogin(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const { ssid_Hash, password } = req.body;

      const instructor = await Instructor.findOne({ ssid_Hash });
      if (!instructor) {
        errors.ssid_Hash = "ssid_Hash number not found";
        return res.status(404).json(errors);
      }
      const isCorrect = await bcrypt.compare(password, instructor.password);
      if (!isCorrect) {
        errors.password = "Invalid Password";
        return res.status(404).json(errors);
      }
      const payload = {
        id: instructor.id,
        instructor,
      };
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token,
        });
      });
    } catch (err) {
      console.log("Error in instructor login", err.message);
    }
  },
  fetchStudents: async (req, res, next) => {
    try {
      const { errors, isValid } = validateFetchStudentsInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { department, year, section } = req.body;
      const subjectList = await Subject.find({ department, year });
      if (subjectList.length === 0) {
        errors.department = "No Subject found in given department";
        return res.status(404).json(errors);
      }
      const students = await Student.find({ department, year, section });
      if (students.length === 0) {
        errors.department = "No Student found";
        return res.status(404).json(errors);
      }
      res.status(200).json({
        result: students.map((student) => {
          var student = {
            _id: student._id,
            code_Hash: student.code_Hash,
            name: student.name,
          };
          return student;
        }),
        subjectCode: subjectList.map((sub) => {
          return sub.subjectCode;
        }),
      });
    } catch (err) {
      console.log("error in instructor fetchStudents", err.message);
    }
  },
  markAttendence: async (req, res, next) => {
    try {
      const { selectedStudents, subjectCode, department, year, section } =
        req.body;

      const sub = await Subject.findOne({ subjectCode });

      //All Students
      const allStudents = await Student.find({ department, year, section });

      var filteredArr = allStudents.filter(function (item) {
        return selectedStudents.indexOf(item.id) === -1;
      });

      //Attendence mark
      for (let i = 0; i < filteredArr.length; i++) {
        const pre = await Attendence.findOne({
          student: filteredArr[i]._id,
          subject: sub._id,
        });
        if (!pre) {
          const attendence = new Attendence({
            student: filteredArr[i],
            subject: sub._id,
          });
          attendence.totalLecturesByFaculty += 1;
          await attendence.save();
        } else {
          pre.totalLecturesByFaculty += 1;
          await pre.save();
        }
      }
      for (var a = 0; a < selectedStudents.length; a++) {
        const pre = await Attendence.findOne({
          student: selectedStudents[a],
          subject: sub._id,
        });
        if (!pre) {
          const attendence = new Attendence({
            student: selectedStudents[a],
            subject: sub._id,
          });
          attendence.totalLecturesByFaculty += 1;
          attendence.lectureAttended += 1;
          await attendence.save();
        } else {
          pre.totalLecturesByFaculty += 1;
          pre.lectureAttended += 1;
          await pre.save();
        }
      }
      res.status(200).json({ message: "done" });
    } catch (err) {
      console.log("error", err.message);
      return res
        .status(400)
        .json({ message: `Error in marking attendence${err.message}` });
    }
  },
  getAllSubjects: async (req, res, next) => {
    try {
      const allSubjects = await Subject.find({});
      if (!allSubjects) {
        return res
          .status(404)
          .json({ message: "You havent registered any subject yet." });
      }
      res.status(200).json({ allSubjects });
    } catch (err) {
      res
        .status(400)
        .json({ message: `error in getting all Subjects", ${err.message}` });
    }
  },
  uploadMarks: async (req, res, next) => {
    try {
      const { errors, isValid } = validateFacultyUploadMarks(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const {
        subjectCode,
        exam,
        totalMarks,
        marks,
        department,
        year,
        section,
      } = req.body;
      const subject = await Subject.findOne({ subjectCode });
      const isAlready = await Mark.find({
        exam,
        department,
        section,
        subjectCode: subject._id,
      });
      if (isAlready.length !== 0) {
        errors.exam = "You have already uploaded marks of given exam";
        return res.status(400).json(errors);
      }
      for (var i = 0; i < marks.length; i++) {
        const newMarks = await new Mark({
          student: marks[i]._id,
          subject: subject._id,
          exam,
          department,
          section,
          marks: marks[i].value,
          totalMarks,
        });
        await newMarks.save();
      }
      res.status(200).json({ message: "Marks uploaded successfully" });
    } catch (err) {
      console.log("Error in uploading marks", err.message);
    }
  },
};
