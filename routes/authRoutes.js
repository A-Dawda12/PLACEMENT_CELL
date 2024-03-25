const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport'); 




// Sign up route
router.get('/signup', userController.getSignup);
router.post('/signup', authController.postSignup);

// Sign in route
router.get('/signin', userController.getSignin);
router.post('/signin', authController.postSignin);

//csv download
router.get('/downloadCsv', passport.checkAuthentication, userController.downloadCsv);

// Logout route
router.get('/logout', passport.checkAuthentication, authController.logout);

module.exports = router;
