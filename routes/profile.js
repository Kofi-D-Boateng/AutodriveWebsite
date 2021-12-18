"use strict";
const express = require("express");
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { parse } = require("json2csv");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, getFileStream } = require("./s3");
const util = require("util");
const fs = require("fs");
const unLinkFile = util.promisify(fs.unlink);

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
          userPFP: req.user.userimage,
        });
      }
    });
  } else {
    res.redirect("login");
  }
});

// GRAB PROFILE PICTURE
router.get("/:key", (req, res) => {
  if (req.isAuthenticated()) {
    const key = req.params.key;
    const readStream = getFileStream(key);
    console.log(
      "\n GRAB THIS FOR CONDITIONAL RENDERING " + readStream["Key"] + "\n"
    );
    readStream.pipe(res);
  }
});

// UPLOAD PROFILE PICTURE

router.post("/avatar", upload.single("avatar"), async (req, res) => {
  if (req.isAuthenticated()) {
    const file = req.file;
    console.log("THIS IS THE FILE. LOOK FOR FILENAME--> " + file + "\n");
    const result = await uploadFile(file);
    console.log(result["Key"] + " FOUND KEY" + "\n");
    User.findOne({ username: req.user.username }, (err, foundUser) => {
      if (foundUser) {
        foundUser.userimage = result["Key"];
        foundUser.save((err) => {
          if (err) {
            console.log("THIS IS A SAVING ERROR--> " + err);
          }
        });
      }
    });
    await unLinkFile(file.path);
    res.redirect("/profile");
  } else {
    console.log("UNSUCCESSFUL POST");
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
            // PASSED TEST SWITCH STATEMENT NEEDS TO BE SCOPED
            case newUpdate.username !== "" &&
              newUpdate.username !== User.find({ username: { $ne: null } }):
              foundUser.username = newUpdate["username"];
            case newUpdate.company !== null || newUpdate.company >= 3:
              foundUser.company = newUpdate["company"];
            case newUpdate.location !== null || newUpdate.location >= 3:
              foundUser.location = newUpdate["location"];
            case newUpdate.position !== null || newUpdate.position >= 3:
              foundUser.position = newUpdate["position"];
              break;
            default:
              console.log("FAILED TO ENTER ANYTHING" + err + "\n");
              break;
          }
          foundUser.save((err) => {
            if (err) {
              console.log("THERE WAS AN ERROR: " + err + "\n");
            } else {
              console.log("SUCCESSFULLY CHANGED POSITION");
            }
          });
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
