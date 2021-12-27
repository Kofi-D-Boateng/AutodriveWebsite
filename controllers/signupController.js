"use strict";
const passport = require("passport");
var User = require("../models/user");

const signup_index = (req, res) => {
  const signupErrors = req.flash().error || [];
  res.render("signup", { signupErrors });
};

const signup_validation = async (req, res) => {
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
};

module.exports = {
  signup_index,
  signup_validation,
};
