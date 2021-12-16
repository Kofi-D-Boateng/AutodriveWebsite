var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("contact", { navbar: navbarLoggedIn });
  } else {
    res.render("contact", { navbar: navbar });
  }
});

module.exports = router;
