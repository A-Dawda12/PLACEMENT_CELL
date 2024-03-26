const express = require('express');
//const passport = require('passport');
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//interview list page
router.get('/home', authMiddleware.checkAuthentication, interviewController.interviewList);

//get student list for allocation
router.get('/allocateStudent', authMiddleware.checkAuthentication, interviewController.renderStudentList);


//submit form post

router.post('/scheduleInterview', authMiddleware.checkAuthentication, interviewController.scheduleInterview);

router.post('/updateStatus/:id', authMiddleware.checkAuthentication, interviewController.updateStatus);


module.exports = router;

