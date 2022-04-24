"use-strict";
var express = require("express");
const { navbar, navbarLoggedIn } = require("../utils/constants");
var router = express.Router();

router.get("/", (req, res) => {
  const success = req.flash().success || [];
  if (req.isAuthenticated()) {
    res.render("../views/home", {
      navbar: navbarLoggedIn,
      success,
    });
  } else {
    res.render("../views/home", { navbar: navbar, success });
  }
});
router.get("/development", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("development", { navbar: navbarLoggedIn });
  } else {
    res.render("development", { navbar: navbar });
  }
});
router.get("/machine-learning", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("machine-learning", { navbar: navbarLoggedIn });
  } else {
    res.render("machine-learning", { navbar: navbar });
  }
});
router.get("/cyber-security", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("cyber-security", { navbar: navbarLoggedIn });
  } else {
    res.render("cyber-security", { navbar: navbar });
  }
});

module.exports = router;
