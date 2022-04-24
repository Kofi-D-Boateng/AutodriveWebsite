"use strict";
require("dotenv").config();
var express = require("express");
var router = express.Router();
const { navbar, navbarLoggedIn } = require("../utils/constants");

router.get("/", (req, res) => {
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
