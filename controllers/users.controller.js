const User = require("../models/User.model");
const { sendActivationEmail } = require("../config/mailer");
const passport = require('passport')


module.exports.profile = (req, res, next) => {
      res.render("user/profile",);
};

module.exports.login = (req, res, next) => {
      res.render("login",);
};

module.exports.register = (req, res, next) => {
      res.render("register",);
};

module.exports.doRegister = (req, res, next) => {
      //req.body.location = { type: 'Point', coordinates: [Math.random(), Math.random()] };
      if (req.files.length > 0) {
            let pictureArray = [];
      
      for (i=0; i<req.files.length; i++) {
            pictureArray.push(req.files[i].path)
            }
      req.body.profilePictures = pictureArray;
      }
      User.create(req.body)
      .then((u) => {
            sendActivationEmail(u.email, u.firstName, u.activationToken);
            res.render("login", {succesMessage: "Register finished. Check you email to validate your account."});
          })
};


module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('login', { user: req.body, errorMessage: validations.error });
    } else {
      req.login(user, loginErr => {
        if (loginErr) next(loginErr)
        else res.redirect('/')
      })
    }
  })(req, res, next);
};

module.exports.view = (req, res, next) => {
      User.find({username: req.params.username})
      .then(users => {
            res.render('user/view', {users})
      })
};

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};


module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    { activationToken: req.params.token, active: false },
    { active: true, activationToken: "active" }
  )
    .then((u) => {
      if (u) {
        res.render("login", {
          username: u.username,
          succesMessage: "Account activated! Now you can log in.",
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((e) => next(e));
};