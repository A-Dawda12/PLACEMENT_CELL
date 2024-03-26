const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
//const passport = require('passport');

//get form
router.get('/addStudent', authMiddleware.checkAuthentication, studentController.addStudent);

// Route to handle adding a new student
router.post('/addStudent', authMiddleware.checkAuthentication, studentController.addStudentPost);

//delet student record
router.get('/delete/:id', authMiddleware.checkAuthentication, studentController.deletStudent);

module.exports = router;