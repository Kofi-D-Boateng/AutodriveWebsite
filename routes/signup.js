var express = require("express");
var router = express.Router();
const passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
  const signupErrors = req.flash().error || [];
  res.render("signup", { signupErrors });
});
router.post("/auth", function (req, res) {
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
