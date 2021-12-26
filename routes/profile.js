"use strict";
const express = require("express");
var router = express.Router();
const User = require("../models/user");
require("passport");
var {
  Parser,
  transforms: { unwind },
} = require("json2csv");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, getFileStream } = require("./s3");
const util = require("util");
const fs = require("fs");
const unLinkFile = util.promisify(fs.unlink);
const rateLimiter = require("express-rate-limit");

// Rate-limiting ruleset
const accountAbuseLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too change requests. Please try again later.",
});
const deleteAbuseLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, //5 minutes
  max: 1, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message:
    "Request for deletion has exceeded alotted amount. If abuse is found, your IP will be blocked",
});
const csvAbuseLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 20, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many request for purchases were made. PLease try again later.",
});

// GET THE ACCOUNT
router.get("/", function (req, res) {
  console.log("THE ROUTE WAS FINALLY HIT \n");
  const error = req.flash().error || [];
  if (req.isAuthenticated()) {
    // QUERY FOR ORDERS
    let id = req.user.id;
    User.findById(id, (err, foundUser) => {
      if (foundUser) {
        let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
        let dateObj = req.user.createdAt;
        let createdDate = dateObj.toString().slice(4, 16);
        // PURCHASE ARRAY *WORK ON THIS TOMORROW*

        res.render("profile", {
          error,
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
router.get("/:key", async (req, res) => {
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

router.post(
  "/avatar",
  upload.single("avatar"),
  accountAbuseLimiter,
  async (req, res) => {
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
  }
);

// MAKING UPDATES
router.post("/update", accountAbuseLimiter, async (req, res) => {
  console.log("UPDATING ROUTE HIT \n");
  try {
    console.log("MADE IT INSIDE THE TRY ROUTE \n");
    if (req.isAuthenticated()) {
      await User.findOne({ username: req.user.username }, (err, foundUser) => {
        if (foundUser) {
          console.log(
            "FOUND USER \n" + foundUser + "\n" + req.params.id + "\n"
          );
          const newUpdate = {
            username: req.body.username,
            company: req.body.company,
            location: req.body.location,
            position: req.body.position,
          };
          if (!newUpdate) {
            req.flash("error", "There is no input to update");
            res.redirect("/profile");
            return;
          } else {
            while (newUpdate) {
              if (
                newUpdate.username.trim().length >= 3 &&
                newUpdate.username !== User.find({ username: { $ne: null } })
              ) {
                foundUser.username = newUpdate["username"];
              }
              if (newUpdate.company.trim().length >= 3) {
                foundUser.company = newUpdate["company"];
              }
              if (newUpdate.location.trim().length >= 3) {
                foundUser.location = newUpdate["location"];
              }
              if (newUpdate.position.trim().length >= 3) {
                foundUser.position = newUpdate["position"];
              }
              foundUser.save((err) => {
                if (err) {
                  console.log(err);
                }
              });
              break;
            }
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

// THIS STILL NEEDS TO BE FIXED////////
// DOWNLOADING CSV OF PURCHASES
router.post("/purchased-items/", csvAbuseLimiter, async (req, res) => {
  if (req.isAuthenticated()) {
    let foundUser = await User.findOne({ username: req.user.username });
    if (foundUser) {
      console.log(foundUser);
      const userPurchases = foundUser.purchases;
      const fields = ["name", "order", "duration", "asset"];
      const json2cvsParser = new Parser({ fields });
      try {
        const csv = await json2cvsParser.parse(userPurchases);
        res.attachment(`${req.user.username}-purchases.csv`);
        res.status(200).send(csv);
        req.flash("success", "successful download");
      } catch (error) {
        console.log("error:", error.message);
        res.status(500).send(error.message);
      }
    }
  }
});

// REMOVING ACCOUNT FROM DATABASE
router.post("/account/delete", deleteAbuseLimiter, async (req, res) => {
  if (req.isAuthenticated()) {
    let checkedBox = req.body.destroy;
    if (checkedBox === "on") {
      await User.findOneAndDelete({
        username: req.user.username,
      })
        .then(
          req.flash("success", "Your account was deleted"),
          req.destroy(),
          req.logout(),
          res.redirect("/")
        )
        .catch((err) => req.flash("error", "Something went wrong"));
    }
  }
});
module.exports = router;
