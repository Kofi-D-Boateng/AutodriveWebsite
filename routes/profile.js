"use strict";
const express = require("express");
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const multer = require("multer");
const { parse } = require("json2csv");

// Profile Avatar
const upload = multer({ dest: "upload" });
// ACCOUNT ROUTES

// GET THE ACCOUNT
router.get("/", function (req, res) {
  console.log("THE ROUTE WAS FINALLY HIT \n");
  if (req.isAuthenticated()) {
    // QUERY FOR ORDERS
    let id = req.user.id;
    User.findById(id, (err, foundUser) => {
      if (foundUser) {
        let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
        let dateObj = req.user.createdAt;
        let createdDate = dateObj.toString().slice(4, 16);
        let size = 3;
        let newObject = foundUser.purchases;
        let Purchases = newObject.slice(-4);

        res.render("profile", {
          purchases: Purchases,
          currentUser: req.user.username,
          currentCompany: req.user.company,
          currentLocation: req.user.location,
          currentPosition: req.user.position,
          memberStatus: createdDate,
          navbar: navbarLoggedIn,
        });
      }
    });
  } else {
    res.redirect("login");
  }
});

// MAKING UPDATES
router.post("/update/:id", (req, res) => {
  const updateInfo = {
    position: req.body.position,
    company: req.body.company,
    location: req.body.location,
    username: req.body.username,
  };
  User.insertMany({ location: location }, function (err) {
    if (req.isAuthenticated() && !err) {
      Console.log("Successful Entry");
    } else {
      Console.log("There was an error with your entry");
    }
  });
  res.render("profile");
});

// THIS NEEDS TO BE FIXED////////
// DOWNLOADING CSV OF PURCHASES
router.post("/purchased-items/:id", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById({ _id: req.params.id }, (err, foundUser) => {
      if (!foundUser) {
        console.log(err);
      } else {
        console.log(foundUser);
      }
    });
  }
});

// REMOVING ACCOUNT FROM DATABASE
router.post("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    let checkedBox = req.body.destroy;
    if (checkedBox === "on") {
      User.findOneAndRemove({ id: req.params.id })
        .then(
          req.flash("Success", "Your account was deleted"),
          req.destroy(),
          req.logout(),
          res.redirect("/")
        )
        .catch((err) => req.flash("error", "Something went wrong"));
    }
  }
});
module.exports = router;
