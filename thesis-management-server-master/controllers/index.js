const express = require('express');
const app = express();
const router = express.Router();
const Login = require('./AuthService/login');
const LecturerThesis = require('./LecturerService/lecturerThesis');
const StudentThesis = require('./StudentService/studentThesis');
const ThesisInfo = require('./ThesisService/thesisInfo');
const StudentInfo = require('./StudentService/studentInfo');
const LecturerInfo = require('./LecturerService/lecturerInfo');

app.use('/', Login.registerRoute(router));
app.use('/', LecturerThesis.registerRoute(router));
app.use('/', StudentThesis.registerRoute(router));
app.use('/', ThesisInfo.registerRoute(router));
app.use('/', StudentInfo.registerRoute(router));
app.use('/', LecturerInfo.registerRoute(router));


module.exports = router;
