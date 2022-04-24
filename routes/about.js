"use strict";
var express = require("express");
var router = express.Router();
const { navbar, navbarLoggedIn } = require("../utils/constants");
require("passport");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("about", { navbar: navbarLoggedIn });
  } else {
    res.render("about", { navbar: navbar });
  }
});

module.exports = router;
