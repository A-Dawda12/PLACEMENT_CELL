const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const passport = require('passport');

//get form
router.get('/addStudent', passport.checkAuthentication, studentController.addStudent);

// Route to handle adding a new student
router.post('/addSStudent', passport.checkAuthentication, studentController.addStudent);

//delet student record
router.delete('/delete/:id', passport.checkAuthentication, studentController.deletStudent)

module.exports = router;