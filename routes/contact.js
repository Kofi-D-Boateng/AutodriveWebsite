"use strict";
var express = require("express");
var router = express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("contact", {
      navbar: navbarLoggedIn,
      teamEmail: process.env.TEAM_EMAIL,
    });
  } else {
    res.render("contact", {
      navbar: navbar,
      teamEmail: process.env.TEAM_EMAIL,
    });
  }
});

module.exports = router;