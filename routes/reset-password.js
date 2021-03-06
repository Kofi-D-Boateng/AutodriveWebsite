require("dotenv").config();
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const rateLimiter = require("express-rate-limit");
const {
  reset_password_index,
  reset_password_validation,
} = require("../controllers/resetPasswordController");

// Rate-limiting ruleset
const rollbackLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many rollback request. Please request another link.",
});

router.get("/:token", reset_password_index);

router.post(
  "/changed-password/validation",
  rollbackLimiter,
  reset_password_validation
);

module.exports = router;
