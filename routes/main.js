var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("home", { navbar: navbarLoggedIn });
  } else {
    res.render("home", { navbar: navbar });
  }
});
router.get("/development", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("development", { navbar: navbarLoggedIn });
  } else {
    res.render("development", { navbar: navbar });
  }
});
router.get("/machine-learning", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("machine-learning", { navbar: navbarLoggedIn });
  } else {
    res.render("machine-learning", { navbar: navbar });
  }
});
router.get("/cyber-security", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("cyber-security", { navbar: navbarLoggedIn });
  } else {
    res.render("cyber-security", { navbar: navbar });
  }
});

module.exports = router;