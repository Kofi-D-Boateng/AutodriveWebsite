"use strict";
const jwt = require("jsonwebtoken");
var user = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");
var User = require("../models/user");

const forgot_password_index = (req, res) => {
  let error = req.flash().error || [];
  res.render("forgot-password", {
    error
  });
};

const forgot_password_validation = async (req, res) => {
  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.TEAM_EMAIL,
        pass: process.env.TEAM_EMAIL_CREDENTIALS,
      },
    })
  );
  let query = await user.findOne({
    email: req.body.email
  });
  if (query === null) {
    req.flash("error", "Email does not exist. Please try again.");
    res.redirect("/forgot-password");
  } else {
    const JWT_SECRET = process.env.JWT_SECRET
    const secret = JWT_SECRET;
    const payload = {
      email: query.email,
      id: query.username,
    };
    const token = jwt.sign(payload, secret, {
      expiresIn: "5m"
    });
    query.updateOne({
      resetlink: token
    }, (err) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/login");
      }
    });
    const link = process.env.HOSTED_LINK
    try {
      var mailOptions = {
        from: process.env.TEAM_EMAIL,
        to: `${query["email"]}`,
        subject: `Password Reset`,
        text: `A password reset request has been initiated by your account. Below is the link to reset your password.
              link: ${link}

              Autodrive
              Arlington, Texas`,
      };
      transport.sendMail(mailOptions, (err, info) => {
        if (!err) {
          req.flash(
            "success",
            "An email has been sent to reset your password."
          );
          res.redirect("/");
        }
      });
    } catch (error) {
      req.flash(
        "error",
        "Email was not sent. Something went wrong on our end."
      );
      res.redirect("/");
    }
  }
};

module.exports = {
  forgot_password_index,
  forgot_password_validation,
};