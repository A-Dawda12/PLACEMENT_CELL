const express = require('express');
const passport = require('passport');
const interviewController = require('../controllers/interviewController');
const router = express.Router();

//interview list page
router.get('home', passport.checkAuthentication, interviewController.interviewList);

//get student list for allocation
router.get('allocateStudent', passport.checkAuthentication, interviewController.renderStudentList);


//submit form post

router.post('/scheduleInterview', passport.checkAuthentication, interviewController.scheduleInterview);

router.post('/updateStatus/:id', passport.checkAuthentication, interviewController.updateStatus);


module.exports = router;

