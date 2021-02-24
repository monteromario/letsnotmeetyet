const User = require("../models/User.model");

module.exports.home = (req, res, next) => {
      User.find()
      .then(users => res.render("home", {users}))
};