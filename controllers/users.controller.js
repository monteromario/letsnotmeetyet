const User = require("../models/User.model");

module.exports.profile = (req, res, next) => {
  res.render("profile");
};

module.exports.login = (req, res, next) => {
  res.render("login");
};

module.exports.register = (req, res, next) => {
  res.render("register");
};

module.exports.doRegister = (req, res, next) => {
  req.body.location = {
    type: 'Point',
    coordinates: [Number(req.body.lng), Number(req.body.lat)]
  };

  if (req.files.length > 0) {
    req.body.profilePictures = req.files.map(file => file.path);

    // for (i = 0; i < req.files.length; i++) {
    //   pictureArray.push(req.files[i].path);
    // }
    // req.body.profilePictures = pictureArray;
  }

  console.log(req.body)

  User.create(req.body)
    .then(() => res.send(req.body))
    .catch(e => console.log('error creating user: ', e));
};
