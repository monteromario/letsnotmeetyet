const passport = require('passport')
const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const usersController = require("../controllers/users.controller");
//const productsController = require("../controllers/products.controller");
const secure = require("../middlewares/secure.middleware");
const upload = require('./storage.config')

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

// Misc

router.get("/", miscController.home);

// Users

router.get("/register", secure.isNotAuthenticated, usersController.register);
router.post("/register", secure.isNotAuthenticated, usersController.doRegister);
router.get("/login", secure.isNotAuthenticated, usersController.login);
router.post("/login", secure.isNotAuthenticated, usersController.doLogin);
router.get(
  "/activate/:token",
  secure.isNotAuthenticated,
  usersController.activate
);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/authenticate/google/cb', usersController.doLoginGoogle)
router.post("/logout", secure.isAuthenticated, usersController.logout);
router.get("/profile", secure.isAuthenticated, usersController.profile);
router.get("/wishlist", secure.isAuthenticated, usersController.wishlist);
router.get("/users", secure.checkRole('ADMIN'), usersController.list);

// Products
router.get(
  "/products/create",
  secure.isAuthenticated,
  productsController.create
);
router.post(
  "/products/create",
  secure.isAuthenticated,
  upload.single("image"),
  productsController.doCreate
);
router.get("/products/:id", productsController.detail);
router.get(
  "/products/:id/edit",
  secure.isAuthenticated,
  productsController.edit
);
router.post(
  "/products/:id/edit",
  secure.isAuthenticated,
  upload.single("image"),
  productsController.doEdit
);
router.get(
  "/products/:id/delete",
  secure.isAuthenticated,
  productsController.delete
);

// Likes
router.get(
  "/product/:productId/like",
  secure.isAuthenticated,
  miscController.like
);

module.exports = router;