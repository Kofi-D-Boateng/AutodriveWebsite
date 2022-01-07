"use strict";
var express = require("express");
var router = express.Router();
require("dotenv").config()


router.get("*", (req, res) => {
    let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
    let navbar = "partials/navbar.ejs";
    const success = req.flash().success || [];
    if (req.isAuthenticated()) {
        res.render("error", {
            navbar: navbarLoggedIn,
        });
    } else {
        res.render("error", {
            navbar: navbar,
        });
    }
})

module.exports = router