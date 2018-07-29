const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

// sanitize and check name, email & password
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name.').notEmpty();
  req.checkBody('email', 'That email address is not valid.').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'You must supply a password.').notEmpty();
  req.checkBody('password-confirm', 'You must supply a password.').notEmpty();
  req
    .checkBody('password-confirm', 'Passwords do not match.')
    .equals(req.body.password);

  // run and place all checks into errors object
  const errors = req.validationErrors();
  // flash error message for each contained error
  // re-render page while keeping user data and flashes
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return; // stop running
  }
  next(); // if there were no errors
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // pass to authController.login
};
