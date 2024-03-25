const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

// Load environment variables from .env file if using dotenv
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Initialize Express app
const app = express();

// Connect to MongoDB database
connectDB();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 100 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Set up routes
app.use('/', require('./routes'));

// const interviewRoutes = require('./routes/interviewRoutes');
// const studentRoutes = require('./routes/studentRoutes');
// const jobRoutes = require('./routes/jobRoutes'); // If implementing bonus feature
// app.use('/api/auth', authRoutes);
// // app.use('/api/interviews', interviewRoutes);
// // app.use('/api/students', studentRoutes);
// // app.use('/api/jobs', jobRoutes); // If implementing bonus feature

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
