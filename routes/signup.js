var express = require("express");
var router = express.Router();
const rateLimiter = require("express-rate-limit");
const {
  signup_index,
  signup_validation,
} = require("../controllers/signupController");

// Rate-limiting ruleset
const createAccountLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many account sign up attempts. Please try again later.",
});

router.get("/", signup_index);
router.post("/auth", createAccountLimiter, signup_validation);
module.exports = router;
