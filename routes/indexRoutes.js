const express = require('express');
const router = express.Router();

// Import routes for different modules
const userRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const homeController = require('../controllers/homeController');
const interviewRoutes = require('./interviewRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for the home page
router.get('/', authMiddleware.checkAuthentication, homeController.homePage); 

// Mount routes for user-related operations
router.use('/users', userRoutes);

// Mount routes for student-related operations
router.use('/students', studentRoutes);

// Mount routes for interview-related operations
router.use('/company', interviewRoutes);

module.exports = router;
