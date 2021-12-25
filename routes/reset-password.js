require("dotenv").config();
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const rateLimiter = require("express-rate-limit");

// Rate-limiting ruleset
const rollbackLimiter = rateLimiter({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many rollback request. Please request another link.",
});

router.get("/:token", async (req, res) => {
  const { token } = req.params;
  console.log(token);
  if (!token) {
    console.log("restlink either does not exist or is expired");
    return;
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
      if (!err) {
        console.log(decodedData);
        const error = req.flash().error || [];
        res.render("reset-password", { token, error });
      } else {
        console.log("FIX THE DAMN TOKEN TOMORROW" + err);
        return;
      }
    });
  }
});

router.post(`/validation`, rollbackLimiter, async (req, res) => {
  const { username, newPassword, confirmedPassword } = req.body;
  let query = await user.findOne({ username: username });
  // CHECK FOR USERNAME SPRAY & MISMATCH PASSWORD
  jwt.verify(query.resetlink, process.env.JWT_SECRET, async (err) => {
    if (err) {
      res.send(err);
    } else if (newPassword !== confirmedPassword) {
      res.send("PASSWORDS DO NOT MATCH");
    } else {
      try {
        let savedUser = await query.setPassword(newPassword);
        await savedUser.save();
        console.log("SUCCESS");
        res.redirect("/");
      } catch (error) {
        console.log(error);
      }
    }
  });
});

module.exports = router;
