"use strict";
var express = require("express");
var router = express.Router();
const passport = require("passport");
const rateLimiter = require("express-rate-limit");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
let user = require("../models/user");
const { application } = require("express");

// Rate-limiting ruleset
const loginAccountLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many login attempts. Please try again later.",
});

router.get("/", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  const errors = req.flash().error || [];
  if (req.isAuthenticated()) {
    res.render("login", { navbar: navbarLoggedIn });
  } else {
    res.render("login", { navbar: navbar, errors });
  }
});
router.post(
  "/auth",
  loginAccountLimiter,
  passport.authenticate("local", {
    failureFlash: true,
    successMessage: true,
    successRedirect: "/",
    successFlash: { type: "success", message: "Successfully logged in." },
    failureRedirect: "/login",
    failureFlash: { type: "error", message: "Invalid username or password" },
  })
);

// GOOGLE OAUTH
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
