var express = require("express");
var router = express.Router();
const passport = require("passport");
var User = require("../models/user");
const rateLimiter = require("express-rate-limit");

// Rate-limiting ruleset
const createAccountLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many account sign up attempts. Please try again later.",
});

router.get("/", function (req, res) {
  const signupErrors = req.flash().error || [];
  res.render("signup", { signupErrors });
});
router.post("/auth", createAccountLimiter, (req, res) => {
  User.register(
    {
      username: req.body.username,
      email: req.body.email,
      company: req.body.company,
      location: req.body.location,
      position: req.body.position,
    },
    req.body.password,
    function (err, user) {
      let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
      if (!err && user) {
        passport.authenticate("local")(req, res, function () {
          req.flash("success", "Your account was created!");
          res.redirect("/");
        });
      } else {
        req.flash("error", "Username or email has already been taken");
        res.redirect("/signup");
      }
    }
  );
});
module.exports = router;
