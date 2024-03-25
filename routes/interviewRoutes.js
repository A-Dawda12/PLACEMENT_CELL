const express = require('express');
const passport = require('passport');
const companyController = require('../controllers/companyController');
const router = express.Router();

//interview list page
router.get('home', passport.checkAuthentication, companyController.interviewList);

//get student list for allocation
router.get('allocateStudent', passport.checkAuthentication, companyController.renderStudentList);


//submit form post

router.post('/scheduleInterview', passport.checkAuthentication, companyController.scheduleInterview);

router.post('/updateStatus/:id', passport.checkAuthentication, companyController.updateStatus);


module.exports = router;

