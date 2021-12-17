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
        // PURCHASE ARRAY *WORK ON THIS TOMORROW*
        var array = foundUser.purchases;
        for (let i = 0; i < array.length; i++) {
          var newObject = array[i];
        }
        let purchasedOrder = newObject && newObject["order"];
        let purchasedDuration = newObject && newObject["amount"];

        res.render("profile", {
          purchases: purchasedOrder,
          duration: purchasedDuration,
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
  console.log("UPDATING ROUTE HIT \n");

  try {
    console.log("MADE IT INSIDE THE TRY ROUTE \n");
    if (req.isAuthenticated()) {
      User.findOne({ id: req.params.id }, (err, foundUser) => {
        if (foundUser) {
          console.log("FOUND USER \n");
          const newUpdate = {
            username: req.body.username,
            company: req.body.company,
            location: req.body.location,
            position: req.body.position,
          };
          switch (true) {
            // PASSED TEST
            case newUpdate.username !== "" &&
              newUpdate.username !== User.find({ username: { $ne: null } }):
              foundUser.username = newUpdate["username"];
              foundUser.save((err) => {
                if (err) {
                  console.log("THERE WAS AN ERROR(username): " + err + "\n");
                } else {
                  console.log("SUCCESSFULLY CHANGED USERNAME ");
                }
              });
              break;
            case newUpdate.company !== "":
              foundUser.company = newUpdate["company"];
              foundUser.save((err) => {
                if (err) {
                  console.log("THERE WAS AN ERROR(company): " + err + "\n");
                } else {
                  console.log("SUCCESSFULLY CHANGED COMPANY");
                }
              });
              break;
            case newUpdate.location !== "":
              foundUser.location = newUpdate["location"];
              foundUser.save((err) => {
                if (err) {
                  console.log("THERE WAS AN ERROR(location): " + err + "\n");
                } else {
                  console.log("SUCCESSFULLY CHANGED LOCATION");
                }
              });
              break;
            case newUpdate.position !== "":
              foundUser.position = newUpdate["position"];
              foundUser.save((err) => {
                if (err) {
                  console.log("THERE WAS AN ERROR(position): " + err + "\n");
                } else {
                  console.log("SUCCESSFULLY CHANGED POSITION");
                }
              });
              break;

            default:
              console.log("FAILED TO ENTER ANYTHING" + err + "\n");
              break;
          }
          res.redirect("/profile");
        } else {
          console.log("FOUND THE ANSWER" + err + "\n");
        }
      });
    }
  } catch (error) {
    console.log("THERE WAS AN ERROR(caught): " + error + "\n");
  }
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
