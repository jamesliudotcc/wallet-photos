module.exports = function(req, res, next) {
  try {
    if (req.isUnauthenticated()) {
      req.flash('error', 'Please log in or sign up.');
      res.redirect('/');
    }
    next();
  } catch {
    console.log('Something went wrong with isUserAuthenticated middleware');
  }
};
