const User = require("../models/User.model");

module.exports.home = (req, res, next) => {
      User.find({active: true})
      .then(users => res.render("home", {users}))
};


module.exports.search = (req, res, next) => {
      User.find({username: { $regex: req.query.username, $options: "i" }, active: true})
      .then(users => 
            {     
            if (users.length == 0) {res.render("home", {alertMessage: `No results for user search: ${req.query.username}.`, search: req.query.username})} else {
                  res.render("home", {users, search: req.query.username})
                  }
            }
      )
};