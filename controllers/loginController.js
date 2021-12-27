"use strict";
const passport = require("passport");
const rateLimiter = require("express-rate-limit");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const login_index = (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  const errors = req.flash().error || [];
  if (req.isAuthenticated()) {
    res.render("login", { navbar: navbarLoggedIn });
  } else {
    res.render("login", { navbar: navbar, errors });
  }
};

const google_login_auth = (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/");
};

module.exports = {
  login_index,
  google_login_auth,
};
