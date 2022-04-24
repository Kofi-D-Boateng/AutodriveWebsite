"use strict";
const { navbar, navbarLoggedIn } = require("../utils/constants");

const login_index = (req, res) => {
  const errors = req.flash().errors || [];
  if (req.isAuthenticated()) {
    res.render("login", {
      navbar: navbarLoggedIn,
    });
  } else {
    res.render("login", {
      navbar: navbar,
      errors,
    });
  }
};

const google_login_auth = (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/");
};

module.exports = {
  login_index,
  google_login_auth,
};
