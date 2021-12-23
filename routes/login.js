var express = require("express");
var router = express.Router();
const passport = require("passport");

router.route("/").get(function (req, res) {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  const errors = req.flash().error || [];
  if (req.isAuthenticated()) {
    res.render("login", { navbar: navbarLoggedIn });
  } else {
    res.render("login", { navbar: navbar, errors });
  }
});
router.post(
  "/auth",
  passport.authenticate("local", {
    failureFlash: true,
    successMessage: true,
    successRedirect: "/",
    successFlash: { type: "success", message: "Successfully logged in." },
    failureRedirect: "/login",
    failureFlash: { type: "error", message: "Invalid username or password" },
  })
);

module.exports = router;
