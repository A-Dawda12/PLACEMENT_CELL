const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming your User model is defined in a separate file

// module.exports = function (passport){
//     passport.use('local', new LocalStrategy({
//       usernameField: 'email', // Assuming email is used as the username
//       passwordField: 'password'
//     },
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email });

//         if (!user) {
//           return done(null, false, { message: 'Incorrect email or password' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//           return done(null, false, { message: 'Incorrect email or password' });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   ));

//   // Serialize and deserialize employee for session management
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(async function(id, done) {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });


//   // set authenticated user for views
  
// }


module.exports = function (passport) {
  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // Pass 'req' as the first argument to the callback
  }, (req, email, password, done) => {
      User.findOne({ email: email })
          .then(user => {
              if (!user) {
                  return done(null, false, req.flash('error', 'Incorrect email.'));
              }
              user.comparePassword(password)
                  .then(isMatch => {
                      if (isMatch) {
                          return done(null, user);
                      } else {
                          return done(null, false, req.flash('error', 'Incorrect password'));
                      }
                  })
                  .catch(err => done(err));
          })
          .catch(err => done(err));
  }));

  passport.serializeUser(function (user, done) {
      done(null, user.id);
  });
      
  passport.deserializeUser(function (id, done) {
      User.findById(id)
          .then(user => done(null, user))
          .catch(err => done(err));
  });
  
  passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
    next();
  };
}