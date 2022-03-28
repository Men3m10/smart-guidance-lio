const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/key");
//////////////////////////////v alidation //////////////////////////////
const validateStudent = require("../validation/student_regester");
const validateAdminLogin = require("../validation/adminLogin");
const validateInstructor = require("../validation/instructorRegister");
const validateSubject = require("../validation/subjectRegister");

///////////////////////////// models //////////////////////////////////
const Admins = require("../models/Admins");
const Students = require("../models/Students");
const Subjects = require("../models/Subjects");
const Instructor = require("../models/Instructor");
//////////////////////////////////////////////////////////////

module.exports = {
  ///////////////////////////   ADD   ADMIN    //////////////////////////////////////////////////////
  addAdmin: async (req, res) => {
    try {
      const { name, ssid_Hash, department, password_hash } = req.body;

      if (!name || !ssid_Hash || !password_hash || !department) {
        return res.status(400).json({
          success: false,
          message: "Probably you have missed certain fields",
        });
      }
      const admin = await Admins.findOne({ ssid_Hash });
      if (admin) {
        return res
          .status(400)
          .json({ success: false, message: "SSID already exist" });
      }

      const newAdmin = await new Admins({
        name: req.body.name,
        ssid_Hash: req.body.ssid_Hash,
        department: req.body.department,
        password_hash: bcrypt.hashSync(req.body.password_hash),
      });
      await newAdmin.save();
      return res.status(200).json({
        success: true,
        message: "Admin registerd successfully",
        response: newAdmin,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////   GET ALL STUDENTS   /////////////////////////////////////////////////

  getAllStudents: async (req, res) => {
    try {
      const student = await Students.find({});
      if (student.length === 0) {
        return res.status(404).json({ message: "No students found" });
      }
      res.status(200).json({ result: student });
    } catch (err) {
      res
        .status(400)
        .json({ message: `error in getting all student", ${err.message}` });
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////// ADMIN LOGIN   //////////////////////////////////////////////////////

  adminLogin: async (req, res) => {
    try {
      const { errors, isValid } = validateAdminLogin(req.body);

      //check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const { ssid_Hash, password_hash } = req.body;
      const admin = await Admins.findOne({ ssid_Hash });
      if (!admin) {
        errors.ssid_Hash = "SSID number not found";
        return res.status(404).json(errors);
      }
      const isCorrect = await bcrypt.compare(
        password_hash,
        admin.password_hash
      );
      if (!isCorrect) {
        errors.password_hash = "Invalid Password";
        return res.status(404).json(errors);
      }
      const payload = {
        id: admin.id,
        name: admin.name,
        department: admin.department,
      };
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 7200 }, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token,
        });
      });
    } catch (err) {
      console.log("Error in admin login", err.message);
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////   ADD STUDENT    ///////////////////////////////////////////////

  addStudent: async (req, res) => {
    try {
      const { errors, isValid } = validateStudent(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const {
        name,
        year,
        uni_email,
        phone,
        address,
        department,
        GPA,
        elsho3ba,
        sex,
        code_Hash,
        ssid_Hash,
        section,
      } = req.body;
      const student = await Students.findOne({ ssid_Hash });
      if (student) {
        errors.ssid_Hash = "ssid_Hash already exist";
        return res.status(400).json(errors);
      }

      const newStudent = await new Students({
        name,
        year,
        uni_email,
        phone,
        address,
        department,
        GPA,
        elsho3ba,
        sex,
        code_Hash,
        ssid_Hash,
        section,
      });
      await newStudent.save();
      // const subjectts = await subjects.find({ year });
      // if (subjectts.length !== 0) {
      //   for (var i = 0; i < subjectts.length; i++) {
      //     newStudent.subjects.push(subjectts[i]._id);
      //   }
      // }
      await newStudent.save();
      res.status(200).json({ result: newStudent });
    } catch (err) {
      res
        .status(400)
        .json({ message: `error in adding new student", ${err.message}` });
    }
  },
  ////////////////////////////////////////////////////////////////////////////////
  /////////////////////////// add Instructor //////////////////////////////////////////////////
  addInstructor: async (req, res) => {
    try {
      const {
        name,
        password,
        gender,
        department,
        ssid_Hash,
        subjectsCanTeach,
      } = req.body;
      const { errors, isValid } = validateInstructor(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const instructor = await Instructor.findOne({ ssid_Hash });
      if (instructor) {
        return res
          .status(400)
          .json({ success: false, message: "SSID already exist" });
      }

      const newInstructor = await new Instructor({
        name,
        password: bcrypt.hashSync(password),
        gender,
        department,
        ssid_Hash,
        subjectsCanTeach,
      });
      await newInstructor.save();
      return res.status(200).json({
        success: true,
        message: "Instructor registerd successfully",
        response: newInstructor,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// get all instructor //////////////////////////////////
  getAllInstructor: async (req, res) => {
    try {
      const instructors = await Instructor.find({});
      if (instructors.length === 0) {
        return res.status(404).json({ message: "No Record Found" });
      }
      res.status(200).json({ result: instructors });
    } catch (err) {
      res
        .status(400)
        .json({ message: `error in getting new instructor", ${err.message}` });
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Add Subject ////////////////////////////////////////////
  addSubject: async (req, res) => {
    try {
      const { errors, isValid } = validateSubject(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const { totalLectures, department, subjectCode, subjectName, year } =
        req.body;
      const subject = await Subjects.findOne({ subjectCode });
      if (subject) {
        errors.subjectCode = "Given Subject is already added";
        return res.status(400).json(errors);
      }
      const newSubject = await new Subjects({
        totalLectures,
        department,
        subjectCode,
        subjectName,
        year,
      });
      await newSubject.save();
      const students = await Students.find({ department, year });
      if (students.length === 0) {
        errors.department = "No branch found for given subject";
        return res.status(400).json(errors);
      } else {
        for (var i = 0; i < students.length; i++) {
          students[i].subjects.push(newSubject._id);
          await students[i].save();
        }
        res.status(200).json({ newSubject });
      }
    } catch (err) {
      console.log(`error in adding new subject", ${err.message}`);
    }
  },

  ////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// get all subjects /////////////////////////////////////////
  getAllSubjects: async (req, res) => {
    try {
      const allSubjects = await Subjects.find({});
      if (!allSubjects) {
        return res
          .status(404)
          .json({ message: "You havent registered any subject yet." });
      }
      res.status(200).json(allSubjects);
    } catch (err) {
      res
        .status(400)
        .json({ message: `error in getting all Subjects", ${err.message}` });
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// get all instructors ///////////////////////////////////

  getAllInstructorDepart: async (req, res, next) => {
    try {
      const { department } = req.body;
      const allInstructors = await Instructor.find({ department });
      res.status(200).json({ result: allInstructors });
    } catch (err) {
      console.log("Error in gettting all Instructor", err.message);
    }
  },
  ////////////////////////////////////////////////////////////////////////////////////////
  getAllStudent: async (req, res, next) => {
    try {
      const { department, year } = req.body;
      const allStudents = await Students.find({ department, year });
      res.status(200).json({ result: allStudents });
    } catch (err) {
      console.log("Error in gettting all students", err.message);
    }
  },
  ///////////////////////////////////////////////////////////////////////////////////

  getAllSubject: async (req, res, next) => {
    try {
      const { department, year } = req.body;
      const allSubjects = await Subjects.find({ department, year });
      res.status(200).json({ result: allSubjects });
    } catch (err) {
      console.log("Error in gettting all students", err.message);
    }
  },
};
