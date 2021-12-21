var express = require("express");
var router = express.Router();

require("dotenv").config();
// MAILGUN TEST
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API });

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

router.post("/team-help", (req, res) => {
  if (req.isAuthenticated()) {
    try {
      var data = {
        from: "Kofi Boateng <kofiboateng47@gmail.com>",
        to: process.env.TEAM_EMAIL,
        subject: "AUTOMATED TESTING",
        text: "If you see this then it worked",
      };

      mg.messages.create(
        process.env.MAILGUN_DOMAIN,
        data,
        function (error, body) {
          if (error) {
            console.log(error);
          } else {
            console.log(data);
          }
        }
      );
    } catch (error) {}
  }
});

module.exports = router;
