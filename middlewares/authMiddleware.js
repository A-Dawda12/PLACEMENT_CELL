exports.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/users/signin');
  };