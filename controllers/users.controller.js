const User = require("../models/User.model");
const Match = require("../models/Match.model");

const Comment = require("../models/Comment.model");
const { sendActivationEmail } = require("../config/mailer");
const passport = require('passport');
const mongoose = require("mongoose");
const flash = require('connect-flash');


module.exports.profile = (req, res, next) => {
   User.find({ username: res.locals.currentUser.username })
    .populate({
      path: 'comments',
      populate: {
        path: 'author'
      }
    })
    .then(user => {
      let userLocations = {
        username: user[0].username, 
        coordinates: user[0].location.coordinates, 
        userPicture: user[0].profilePictures 
      }
      console.log(userLocations)
      res.render('user/profile', { user, userLocations })
    }
    )
};

module.exports.editProfile = (req, res, next) => {
  res.render("user/edit");
};

module.exports.doEditProfile = (req, res, next) => {
  req.body.location = {
    type: 'Point', 
    coordinates: [ req.body.lat, req.body.lng ]
  }
  console.log(req.body)
  User.findOneAndUpdate({ username: req.body.username }, req.body, {
    new: true
  })
    .then((u) => {
      req.flash('flashMessage', `${u.firstName}, your profile has been updated.`);
    res.redirect('/profile');
})
    .catch(e => {
      console.log('error editing user: ', e);
      req.flash('flashMessage', 'Error editing your profile. Try again.');
      res.redirect('/profile')
    });
};

module.exports.deleteProfile = (req, res, next) => {
   User.deleteOne({_id: res.locals.currentUser.id})
    .then(user => {
      console.log(`User deleted: ${user}`);
      req.flash('flashMessage', 'Your profile has been deleted. Hope to see you back soon.');
      res.redirect('/')
    })
    .catch(e => {
      console.log('error deleting user: ', e);
      req.flash('flashMessage', 'Error deleting your profile. Try again.');
      res.redirect('/profile')
    });
};

module.exports.login = (req, res, next) => {
  res.render("login");
};

module.exports.register = (req, res, next) => {
  res.render("register");
};

module.exports.renderMap = (req, res, next) => {
  User.find()
    .then((users) => {
      const userLocations = users.map((user) => {
        let {
          username,
          location: { coordinates },
          profilePictures,
        } = user;
        userPicture = profilePictures[0];
        return { username, coordinates, userPicture };
      });
      res.render("map", { userLocations });

    })
    .catch((e) => console.log(e));
};

module.exports.doRegister = (req, res, next) => {
  req.body.location = {
    type: "Point",
    coordinates: [Number(req.body.lng), Number(req.body.lat)],
  };

  if (req.files.length > 0) {
    req.body.profilePictures = req.files.map((file) => file.path);
  }
  User.find({$or:[{email: req.body.email},{username: req.body.username}]})
  .then(user => res.render("register", { errorMessage: "Username or email already in use. Log in or try a different combination."}))
  .catch(next)

  User.create(req.body)
    .then((u) => {
      sendActivationEmail(u.email, u.firstName, u.activationToken);
      res.render("login", {
        succesMessage:
          "Register finished. Check you email to validate your account.",
      });
    })
    .catch(e => {
      console.log('error creating user: ', e);
      res.render('register', { errorMessage: e })
    });
}

module.exports.doLogin = (req, res, next) => {
  passport.authenticate("local-auth", (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res
        .status(400)
        .render("login", { user: req.body, errorMessage: validations.error });
    } else {
      req.login(user, (loginErr) => {
        if (loginErr) next(loginErr);
        else res.redirect("/");
      });
    }
  })(req, res, next);
};

module.exports.doLoginGoogle = (req, res, next) => {
  passport.authenticate('google-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('login', { user: req.body, errorMessage: validations.error });
    } else {
      req.login(user, loginErr => {
        if (loginErr) next(loginErr)
        else if (!user.aboutMe) {
          req.flash('flashMessage', 'Your account has been created! Update details in your profile.');
          res.redirect('/profile') }
        else {
          res.redirect('/') }
      })
    }
  })(req, res, next)
}

module.exports.doLoginFacebook = (req, res, next) => {
  passport.authenticate('facebook-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('login', { user: req.body, errorMessage: validations.error });
    } else {
      req.login(user, loginErr => {
        if (loginErr) next(loginErr)
        else if (!user.aboutMe) {
          req.flash('flashMessage', 'Your account has been created! Update details in your profile.');
          res.redirect('/profile') }
        else {
          res.redirect('/') }
      })
    }
  })(req, res, next)
}

module.exports.view = (req, res, next) => {
  User.find({ username: req.params.username })
    .populate({
      path: 'comments',
      populate: {
        path: 'author'
      }
    })
    .then(users => res.render('user/view', { users })
    )
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

module.exports.like = (req, res, next) => {
  console.log('USERID: ' + req.params.userId + "\n" + 'CURRENTUSER: ' + req.currentUser._id)
  //const currentUserQuery = { _id: req.currentUser._id };
  //const likedtUserQuery = { _id: req.params.userId };
  //User.findById(req.currentUser._id)
  // 
  User.find(
    { _id: req.currentUser._id, liked: { $elemMatch: { $eq: req.params.userId } } }
  )
    .then(user => {
      let likedUSer = ""
      User.findById(req.params.userId).then(user => likedUSer = user)
      if (user.length === 0) {
        console.log('LIKE')
        User.findByIdAndUpdate(req.currentUser._id,
          { $push: { liked: req.params.userId } }, { useFindAndModify: false })
          .then(user => console.log(`Added ${req.params.userId} : ${likedUSer.username} to liked`))
          .catch(e => console.log(e))
      } else {
        console.log('UNLIKE')
        User.findByIdAndUpdate(req.currentUser._id,
          { $pull: { liked: req.params.userId } }, { useFindAndModify: false })
          .then(user => console.log(`Removed ${req.params.userId} : ${likedUSer.username} from liked`))
          .catch(e => console.log(e))
      }
      res.redirect(`/user/${likedUSer.username}`)
    })
    .catch(e => console.log(e));
};

module.exports.addComment = (req, res, next) => {
  if (req.body.private == 'on') {req.body.private = true}
  Comment.create(req.body)
  .then((c) => {
    req.flash('flashMessage', 'Message posted!');
    res.redirect(`/user/${req.params.username}`)
  })
}

module.exports.deleteComment = (req, res, next) => {
  console.log(req.headers.referer)
  Comment.deleteOne({_id: req.params.id})
  .then((c) => {
    req.flash('flashMessage', 'Message deleted!');
    if (req.headers.referer.includes('/profile')) {
      res.redirect('/profile')
    } else {
      res.redirect(`/user/${req.params.username}`)
    }
  })
}
