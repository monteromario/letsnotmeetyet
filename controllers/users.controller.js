const User = require("../models/User.model");
const Match = require("../models/Match.model");
const Comment = require("../models/Comment.model");
const { sendActivationEmail } = require("../config/mailer");
const { sendResetEmail } = require("../config/mailer");
const passport = require('passport');
const mongoose = require("mongoose");
const flash = require("connect-flash");

module.exports.profile = (req, res, next) => {
  User.find({ username: res.locals.currentUser.username })
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .then((user) => {
      let userLocations = {
        username: user[0].username, 
        coordinates: user[0].location.coordinates, 
        userPicture: user[0].profilePictures 
      };
      res.render('user/profile', { user, userLocations })
    });
};

module.exports.editProfile = (req, res, next) => {
  res.render("user/edit");
};

module.exports.doEditProfile = (req, res, next) => {
  req.body.location = {
    type: "Point",
    coordinates: [req.body.lat, req.body.lng],
  };
  User.findOneAndUpdate({ username: req.body.username }, req.body, {
    new: true,
  })
    .then((u) => {
      req.flash(
        "flashMessage",
        `${u.firstName}, your profile has been updated.`
      );
      res.redirect("/profile");
    })
    .catch((e) => {
      console.log("error editing user: ", e);
      req.flash("flashMessage", "Error editing your profile. Try again.");
      res.redirect("/profile");
    });
};

module.exports.deleteProfile = (req, res, next) => {
   User.deleteOne({_id: res.locals.currentUser.id})
    .then(user => {
      console.log(`User deleted: ${user.username}`);
      req.flash('flashMessage', 'Your profile has been deleted. Hope to see you back soon.');
      res.redirect('/')
    })
    .catch((e) => {
      console.log("error deleting user: ", e);
      req.flash("flashMessage", "Error deleting your profile. Try again.");
      res.redirect("/profile");
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
  function renderWithErrors(error, data) {
      res.status(400).render("register", {
        errorMessage: error, data}
      )};

  function createUser(user) {
    User.create(user)
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

  req.body.location = {
    type: "Point",
    coordinates: [Number(req.body.lng), Number(req.body.lat)],
  };

  if (req.files.length > 0) {
    req.body.profilePictures = req.files.map((file) => file.path);
  }

  User.find({$or:[{email: req.body.email},{username: req.body.username}]})
  .then(user => {
    if (user.length != 0) {
      renderWithErrors("Username or email already in use. Log in or try a different combination.", req.body)
      } else {
        createUser(req.body)
      }
  })
  .catch(e => {
      console.log('error checking users in DB: ', e);
      renderWithErrors(e);
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
  passport.authenticate("google-auth", (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res
        .status(400)
        .render("login", { user: req.body, errorMessage: validations.error });
    } else {
      req.login(user, (loginErr) => {
        if (loginErr) next(loginErr);
        else if (!user.aboutMe) {
          req.flash(
            "flashMessage",
            "Your account has been created! Update details in your profile."
          );
          res.redirect("/profile");
        } else {
          res.redirect("/");
        }
      });
    }
  })(req, res, next);
};

module.exports.doLoginFacebook = (req, res, next) => {
  passport.authenticate("facebook-auth", (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res
        .status(400)
        .render("login", { user: req.body, errorMessage: validations.error });
    } else {
      req.login(user, (loginErr) => {
        if (loginErr) next(loginErr);
        else if (!user.aboutMe) {
          req.flash(
            "flashMessage",
            "Your account has been created! Update details in your profile."
          );
          res.redirect("/profile");
        } else {
          res.redirect("/");
        }
      });
    }
  })(req, res, next);
};

module.exports.help = (req, res, next) => {
  res.render('help')
};

module.exports.doHelp = (req, res, next) => {
  if (req.body.forgot) {
    User.findOne({ email: req.body.email })
    .then((u) => {
      if (u == null) {
        res.status(400).render('help', { user: req.body, errorMessage: "E-mail not found." })
        }
      else if (u.active) {
        res.render('help', { user: req.body, errorMessage: "Your account is already activated. You can log-in." })
      } else {
        sendActivationEmail(u.email, u.firstName, u.activationToken);
        res.render('help', { user: req.body, succesMessage: "E-mail sent. Check your inbox." })
        next;
      }
    })
    //.catch(res.status(400).render('help', { user: req.body, errorMessage: "E-mail not found." }))
  } else if (req.body.reset) {
      User.findOne({ email: req.body.email })
    .then((u) => {
      if (u == null) {
        res.status(400).render('help', { user: req.body, errorMessage: "E-mail not found." })
        }
      else {
        sendResetEmail(u.email, u.firstName, u.activationToken);
        res.render('help', { user: req.body, succesMessage: "Reset e-mail sent. Check your inbox to continue the process." })
        next;
      }
    })
  }
};

module.exports.view = (req, res, next) => {
  User.find({ username: req.params.username })
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .then((user) => {
      likedByUser = req.currentUser.liked.includes(user[0]._id);
      res.render("user/view", { user, likedByUser });
    });
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
          username: u.email,
          succesMessage: "Account activated! Now you can log in.",
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((e) => next(e));
};

module.exports.like = (req, res, next) => {
  console.log(
    "USERID: " +
      req.params.userId +
      "\n" +
      "CURRENTUSER: " +
      req.currentUser._id
  );
  User.find({
    _id: req.currentUser._id,
    liked: { $elemMatch: { $eq: req.params.userId } },
  })
    .then((user) => {
      let likedUSer = "";
      User.findById(req.params.userId).then((user) => (likedUSer = user));
      if (user.length === 0) {
        //LIKE
        console.log("LIKE");
        User.findByIdAndUpdate(
          req.currentUser._id,
          { $push: { liked: req.params.userId } },
          { useFindAndModify: false }
        )
          .then((user) => {
            console.log(
              `Added ${req.params.userId} : ${likedUSer.username} to liked`
            );
            Match.create({
              liker: req.currentUser._id,
              liked: req.params.userId,
            }).then((match) => {
              console.log(
                `Match created from ${match.liker} to ${match.liked}`
              );
            });
            Match.findOne({
              liker: req.params.userId,
              liked: req.currentUser._id,
            }).then((match) => {
              if (match) {
                console.log(
                  "ITS A MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATCH"
                );
                User.findByIdAndUpdate(
                  req.currentUser._id,
                  { $push: { matched: req.params.userId } },
                  { useFindAndModify: false }
                ).then((user) => {
                  console.log(`Match added to ${user.username}`);
                  //Return response to front
                  res.json({ liked: true, match: true });
                });
              } else {
                res.json({ liked: true });
              }
            });
          })
          .catch((e) => console.log(e));
      } else {
        //UNLIKE
        console.log("UNLIKE");
        User.findByIdAndUpdate(
          req.currentUser._id,
          { $pull: { liked: req.params.userId } },
          { useFindAndModify: false }
        )
          .then((user) => {
            console.log(
              `Removed ${req.params.userId} : ${likedUSer.username} from liked`
            );
            Match.findOneAndDelete({
              liker: req.currentUser._id,
              liked: req.params.userId,
            }).then((match) => {
              console.log(
                `Match removed from ${match.liker} to ${match.liked}`
              );
            });
            User.findByIdAndUpdate(
              req.currentUser._id,
              { $pull: { matches: req.params.userId } },
              { useFindAndModify: false }
            ).then((user) => `Match also removed in ${user.username} ddbb`);
            //Return response to front
            res.json({ liked: false });
          })
          .catch((e) => console.log(e));
      }
      //res.redirect(`/user/${likedUSer.username}`)
    })
    .catch((e) => console.log(e));
};

module.exports.addComment = (req, res, next) => {
  if (req.body.private == "on") {
    req.body.private = true;
  }
  Comment.create(req.body).then((c) => {
    req.flash("flashMessage", "Message posted!");
    res.redirect(`/user/${req.params.username}`);
  });
};

module.exports.deleteComment = (req, res, next) => {
  Comment.deleteOne({_id: req.params.id})
  .then((c) => {
    req.flash('flashMessage', 'Message deleted!');
    if (req.headers.referer.includes('/profile')) {
      res.redirect('/profile')
    } else {
      res.redirect(`/user/${req.params.username}`);
    }
  });
};
