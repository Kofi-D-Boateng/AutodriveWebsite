require("dotenv").config();
var express = require("express");
var router = express.Router();
const rateLimiter = require("express-rate-limit");
const {
  forgot_password_index,
  forgot_password_validation,
} = require("../controllers/forgotPasswordController");

// Rate-limiting ruleset
const tokenAbuseLimiter = rateLimiter({
  windowMs: 8 * 60 * 1000, //8 minutes
  max: 3, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many Purchase attempts. Please try again later.",
});

router.get("/", forgot_password_index);

router.post("/validation", tokenAbuseLimiter, forgot_password_validation);
module.exports = router;
