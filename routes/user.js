
const express = require("express")
const router = express.Router();

const passport = require("passport");
const { use } = require("passport");
const {saveUrl} = require("../middleware");
const userController = require("../controllers/users");

//signup
router.route("/signup")
  .get( userController.signupForm)
  .post( userController.signup);
//login
router.route("/login")
  .get( (req, res) => {
    res.render("users/login.ejs");
  })
  .post(
    saveUrl,
    passport.authenticate("local",
      {
        failureRedirect: "/login",
        failureFlash: true
      }),

    userController.login);
//LOGOUT
router.get("/logout",userController.logout)
module.exports = router;