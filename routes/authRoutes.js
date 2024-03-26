const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport'); 
const authMiddleware = require('../middlewares/authMiddleware');



// Sign up route
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Sign in route
router.get('/signin', authController.getSignin);
router.post('/signin', authController.postSignin);

//csv download
router.get('/downloadCsv', authMiddleware.checkAuthentication, authController.downloadCsv);

// Logout route
router.get('/logout', authMiddleware.checkAuthentication, authController.logout);

module.exports = router;
