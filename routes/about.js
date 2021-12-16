var express = require("express");
var router = express.Router();
var passport = require("passport");

router.get("/", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar";
  let navbarLoggedOut = "partials/navbar";
  if (req.isAuthenticated()) {
    res.render("about", { navbar: navbarLoggedIn });
  } else {
    res.render("about", { navbar: navbarLoggedOut });
  }
});

module.exports = router;
