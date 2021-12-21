var express = require("express");
var router = express.Router();
const passport = require("passport");

router.route("/").get(function (req, res) {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("login", { navbar: navbarLoggedIn });
  } else {
    res.render("login", { navbar: navbar });
  }
});
router.post(
  "/auth",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "wrong username or password",
  }),
  (req, res) => {
    console.log("Auth route was hit.");
    res.redirect("/");
  }
);

module.exports = router;
