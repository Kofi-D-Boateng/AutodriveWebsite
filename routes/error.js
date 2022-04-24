"use strict";
require("dotenv").config();
var express = require("express");
var router = express.Router();
const { navbar, navbarLoggedIn } = require("../utils/constants");

router.get("*", (req, res) => {
  const success = req.flash().success || [];
  if (req.isAuthenticated()) {
    res.render("error", {
      navbar: navbarLoggedIn,
    });
  } else {
    res.render("error", {
      navbar: navbar,
    });
  }
});

module.exports = router;
