"use strict";
const express = require("express");
var router = express.Router();
const User = require("../models/user");
require("passport");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const rateLimiter = require("express-rate-limit");
const profileController = require("../controllers/profileController");

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
router.get("/", profileController.profile_index);

// GRAB PROFILE PICTURE
router.get("/:key", profileController.profile_image);

// UPLOAD PROFILE PICTURE

router.post(
  "/avatar",
  upload.single("avatar"),
  accountAbuseLimiter,
  profileController.profile_pfp_upload
);

// MAKING UPDATES
router.post(
  "/update",
  accountAbuseLimiter,
  profileController.profile_profile_update
);

// THIS STILL NEEDS TO BE FIXED////////
// DOWNLOADING CSV OF PURCHASES
router.post(
  "/purchased-items/",
  csvAbuseLimiter,
  profileController.profile_csv
);

// REMOVING ACCOUNT FROM DATABASE
router.post(
  "/account/delete",
  deleteAbuseLimiter,
  profileController.profile_deletion
);
module.exports = router;
