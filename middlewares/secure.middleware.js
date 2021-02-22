module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/profile')
  } else {
    next()
  }
}

module.exports.checkRole = (role) => (req, res, next) => {
  if (req.isAuthenticated && req.currentUser.role === role) {
    next()
  } else {
    res.redirect('/login')
  }
}