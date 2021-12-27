require("dotenv").config();
var express = require("express");
var router = express.Router();
const rateLimiter = require("express-rate-limit");
const forgotPasswordController = require("../controllers/forgotPasswordController.js");

// Rate-limiting ruleset
const tokenAbuseLimiter = rateLimiter({
  windowMs: 8 * 60 * 1000, //8 minutes
  max: 3, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many Purchase attempts. Please try again later.",
});

router.get("/", forgotPasswordController.forgot_password_index);

router.post(
  "/validation",
  tokenAbuseLimiter,
  forgotPasswordController.forgot_password_validation
);
module.exports = router;
