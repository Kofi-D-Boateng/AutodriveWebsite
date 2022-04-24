"use strict";
var express = require("express");
var router = express.Router();
const rateLimiter = require("express-rate-limit");
const passport = require("passport");
const {
  google_login_auth,
  login_index,
} = require("../controllers/loginController");

// Rate-limiting ruleset
const loginAccountLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many login attempts. Please try again later.",
  keyGenerator: (req, res) => {
    console.log(req.ip);
  },
});

router.get("/", login_index);
router.post(
  "/auth",
  loginAccountLimiter,
  passport.authenticate("local", {
    failureFlash: true,
    successMessage: true,
    successRedirect: "/",
    successFlash: {
      type: "success",
      message: "Successfully logged in.",
    },
    failureRedirect: "/login",
    failureFlash: {
      type: "errors",
      message: "Invalid username or password",
    },
  })
);

// GOOGLE OAUTH
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  google_login_auth
);

module.exports = router;
