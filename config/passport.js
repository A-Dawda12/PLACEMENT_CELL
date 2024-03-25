const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Employee = require('../models/Employee'); // Assuming the Employee model is defined in Employee.js

// Configure Passport to use a Local Strategy for employee authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Assuming employees sign in with email
    passwordField: 'password' // Assuming employees have a password field
  },
  async function(email, password, done) {
    try {
      // Find the employee by email in the database
      const employee = await Employee.findOne({ email });

      // If employee not found or password does not match, return error message
      if (!employee || !(await employee.isValidPassword(password))) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      // If authentication successful, return the employee object
      return done(null, employee);
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize and deserialize employee for session management
passport.serializeUser(function(employee, done) {
  done(null, employee.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const employee = await Employee.findById(id);
    done(null, employee);
  } catch (err) {
    done(err);
  }
});


// check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/users/signin');
};

// set authenticated user for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
