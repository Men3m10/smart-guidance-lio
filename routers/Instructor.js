const express = require("express");
const Router = express.Router();

const {
  instructorLogin,
  fetchStudents,
  getAllSubjects,
  markAttendence,
  uploadMarks,
  findSectionByID,
} = require("../controler/InstructorController");

Router.post("/login", instructorLogin);
Router.post("/fetchStudents", fetchStudents);
Router.post("/markAttendence", markAttendence);
Router.get("/getAllSubjects", getAllSubjects);
Router.get("/findSectionByID", findSectionByID);
Router.post("/uploadMarks", uploadMarks);

module.exports = Router;
