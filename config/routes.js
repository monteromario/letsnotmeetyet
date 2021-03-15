const passport = require("passport");
const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const usersController = require("../controllers/users.controller");
const secure = require("../middlewares/secure.middleware");
const upload = require("./storage.config");

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
const FACEBOOK_SCOPES = ['public_profile', 'email'] 

router.get("/search", miscController.search);
router.get("/", miscController.home);

router.get("/register", secure.isNotAuthenticated, usersController.register);
router.post(
  "/register",
  secure.isNotAuthenticated,
  upload.any(),
  usersController.doRegister
);

router.get("/login", secure.isNotAuthenticated, usersController.login);
router.post("/login", secure.isNotAuthenticated, usersController.doLogin);
router.get("/login/help", secure.isNotAuthenticated, usersController.help);
router.get("/reset/:email/:token", secure.isNotAuthenticated, usersController.reset);
router.post("/reset", secure.isNotAuthenticated, usersController.doReset)
router.post("/login/help", secure.isNotAuthenticated, usersController.doHelp);
router.get("/activate/:token",secure.isNotAuthenticated, usersController.activate);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/authenticate/google/callback', usersController.doLoginGoogle)
router.get('/authenticate/facebook', passport.authenticate('facebook-auth', { scope: FACEBOOK_SCOPES }))
router.get('/authenticate/facebook/callback', usersController.doLoginFacebook)
router.get("/logout", secure.isAuthenticated, usersController.logout);
router.get("/profile", secure.isAuthenticated, usersController.profile);
router.get("/profile/edit", secure.isAuthenticated, usersController.editProfile);
router.post("/profile/edit", secure.isAuthenticated, upload.any(), usersController.doEditProfile)
router.get("/profile/delete", secure.isAuthenticated, usersController.deleteProfile);
router.get("/profile/resetPassword", secure.isAuthenticated, usersController.profileResetPassword);
router.get("/map", usersController.renderMap);
router.get("/favorites", secure.isAuthenticated, usersController.favorites);
router.get("/user/:username", secure.isAuthenticated, usersController.view);
router.get("/user/:userId/like", usersController.like);
router.post("/user/:username/addComment", secure.isAuthenticated, usersController.addComment)
router.get("/user/:username/deleteComment/:id", secure.isAuthenticated, usersController.deleteComment)

module.exports = router;
