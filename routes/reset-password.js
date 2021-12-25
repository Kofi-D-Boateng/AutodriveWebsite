require("dotenv").config();
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var user = require("../models/user");
const rateLimiter = require("express-rate-limit");

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
      } else {
        console.log("FIX THE DAMN TOKEN TOMORROW");
        return;
      }
    });
  }
});

router.post(`/:token/validation`, async (req, res) => {
  console.log("\n" + req.body + "\n");

  let query = await user.findOne({ username: username });
  console.log(query);
  const { user, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    req.flash("error", "Passwords do not match");
    res.redirect("/rest-password/:token");
  } else {
    let query = await user.findOne({ username: user });
    query.setPassword(newPassword, (err) => {
      if (err) {
        console.log(err);
      } else {
        query.save();
        res.redirect("/");
      }
    });
  }
});

module.exports = router;
