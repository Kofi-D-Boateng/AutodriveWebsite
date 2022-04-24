var express = require("express");
var router = express.Router();
const { navbar, navbarLoggedIn } = require("../utils/constants");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("help", { navbar: navbarLoggedIn });
  } else {
    res.render("help", { navbar: navbar });
  }
});

module.exports = router;
