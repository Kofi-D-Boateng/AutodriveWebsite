require("dotenv").config();
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var user = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const rateLimiter = require("express-rate-limit");
const crypto = require("crypto");

// Rate-limiting ruleset
const tokenAbuseLimiter = rateLimiter({
  windowMs: 8 * 60 * 1000, //8 minutes
  max: 3, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many Purchase attempts. Please try again later.",
});

router.get("/", (req, res) => {
  let error = req.flash().error || [];
  res.render("forgot-password", { error });
});

router.post("/validation", tokenAbuseLimiter, async (req, res) => {
  // SMTP  INSTANTIATION
  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: `${process.env.PURCHASE_EMAIL}`,
        pass: `${process.env.TEAM_EMAIL_CREDENTIALS}`,
      },
    })
  );
  let query = await user.findOne({ email: req.body.email });
  console.log(query);
  if (query === null) {
    req.flash("error", "Email does not exist. Please try again.");
    res.redirect("/forgot-password");
  } else {
    const JWT_SECRET = process.env.JWT_SECRET;
    const buffer = crypto.randomBytes(64).toString("hex");
    const secret = JWT_SECRET;
    const payload = {
      email: query["email"],
      id: query["username"],
    };
    console.log(payload.id + "\n");
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    console.log(token);
    query.updateOne({ resetlink: token }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    try {
      var mailOptions = {
        from: `${process.env.PURCHASE_EMAIL}`,
        to: `${query["email"]}`,
        subject: `Password Reset`,
        text: `A password reset request has been initiated by your account. Below is the link to reset your password.
              link: ${link}

              Autodrive
              Arlington, Texas`,
      };
      transport.sendMail(mailOptions, (err, info) => {
        if (!err) {
          console.log("Email sent to" + info.response);
        }
      });
      res.redirect("/");
    } catch (error) {
      throw error;
    }
  }
});
module.exports = router;
