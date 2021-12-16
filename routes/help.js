var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("help", { navbar: navbarLoggedIn });
  } else {
    res.render("help", { navbar: navbar });
  }
});

module.exports = router;
