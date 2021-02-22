require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const routes = require("./config/routes");
const passport = require('passport');
const flash = require('connect-flash');

const session = require("./config/session.config");

require("./config/db.config");
require('./config/passport.config')
require('./config/hbs.config')

// Express config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(logger("dev"));
app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use((req, res, next) => {
  req.currentUser = req.user;
  res.locals.currentUser = req.user;

  res.locals.flashMessage = req.flash('flashMessage')
  res.locals.mapsKey = process.env.MAPS_KEY

  next()
})

app.use("/", routes);

// Error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((error, req, res, next) => {
  console.log(error);
  if (!error.status) {
    error = createError(500);
  }
  res.status(error.status);
  res.render("error", error);
});

// Initialization on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));