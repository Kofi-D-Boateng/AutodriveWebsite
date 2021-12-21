var express = require("express");
var router = express.Router();

require("dotenv").config();
// MAILGUN TEST
// const formData = require("form-data");
// const Mailgun = require("mailgun.js");
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API });

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
