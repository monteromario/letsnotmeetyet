const User = require("../models/User.model");

module.exports.profile = (req, res, next) => {
      res.render("profile",);
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
      .then(() => res.send(req.body))
};
