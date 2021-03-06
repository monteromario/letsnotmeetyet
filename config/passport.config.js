const passport = require('passport');
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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
  callbackURL: process.env.G_REDIRECT_URI
}, (accessToken, refreshToken, profile, next) => {
  const googleID = profile.id
  const email = profile.emails[0] ? profile.emails[0].value : undefined;
  const firstName = profile.name.givenName
  const lastName = profile.name.familyName
  let profilePictures = []
  
  if (profile.photos) {
    profilePictures.push(profile.photos[0].value)
  }

  if (googleID && email) {
    User.findOne({ $or: [
      { email: email },
      { 'social.google': googleID }
    ]})
    .then(user => {
      if (!user) {
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


passport.use('facebook-auth', new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_REDIRECT_URI,
    profileFields: ['id', 'email', 'gender', 'name', 'photos']
  },
  (accessToken, refreshToken, profile, next) => {
    const facebookID = profile.id
    const email = profile.emails[0] ? profile.emails[0].value : undefined;
    const firstName = profile.name.givenName
    const lastName = profile.name.familyName
    let profilePictures = []
    let gender
  
    if (profile.photos) {
      profilePictures.push(profile.photos[0].value)
    }

    if (profile.gender == 'male') {
      gender = 'Male'
    } else if (profile.gender == 'female') {
      gender = 'Female'
    } else {
      gender = 'Other'
    }

    if (facebookID && email) {
    User.findOne({ $or: [
      { email: email },
      { 'social.facebook': facebookID }
    ]})
    .then(user => {
      if (!user) {
        const newUserInstance = new User({
          username: email,
          firstName,
          lastName,
          gender,
          preferences: 'All',
          email,
          profilePictures,
          location: {
            coordinates: [40.39263972770542, -3.6993157057117454]
          },
          password: 'Aa1' + mongoose.Types.ObjectId(),
          social: {
            facebook: facebookID
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
}));