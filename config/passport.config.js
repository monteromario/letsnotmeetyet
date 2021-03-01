const passport = require('passport');
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User.model')

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => next(null, user))
    .catch(next);
});

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        next(null, false, { error: "Incorrect e-mail or password. Try again." })
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (match) {
              if (user.active) {
                next(null, user)
              } else {
                next(null, false, { error: "Your account is not activated. Check your email." })
              }
            } else {
              next(null, false, { error: "Incorrect e-mail or password. Try again." })
            }
          })
      }
    })
    .catch(next)
}))

passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.G_CLIENT_ID,
  clientSecret: process.env.G_CLIENT_SECRET,
  callbackURL: process.env.G_REDIRECT_URI || '/authenticate/google/callback'
}, (accessToken, refreshToken, profile, next) => {
  const googleID = profile.id
  const email = profile.emails[0] ? profile.emails[0].value : undefined;
  const firstName = profile.name.givenName
  const lastName = profile.name.familyName
  let profilePictures = []
  if (profile.photos) {
    profilePictures.push(profile.photos[0].value)
  }

  console.log(profilePictures)

  if (googleID && email) {
    User.findOne({ $or: [
      { email: email },
      { 'social.google': googleID }
    ]})
    .then(user => {
      if (!user) {
        console.log(profile)
        const newUserInstance = new User({
          username: email,
          firstName,
          lastName,
          gender: 'Other',
          preferences: 'All',
          email,
          profilePictures,
          location: {
            coordinates: [40.39263972770542, -3.6993157057117454]
          },
          password: 'Aa1' + mongoose.Types.ObjectId(),
          social: {
            google: googleID
          },
          active: true
        })

        return newUserInstance.save()
          .then(newUser => next(null, newUser))
      } 
      
      else if (user.active) {
        next(null, user)
      } else {
        next(null, false, { error: "Your account is not activated. Check your email." })
      }
    })
    .catch(next)
  } else {
    next(null, null, { error: 'Error connecting Google OAuth' })
  }
}))