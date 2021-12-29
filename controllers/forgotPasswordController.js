"use strict";
const jwt = require("jsonwebtoken");
var user = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");
var User = require("../models/user");

const forgot_password_index = (req, res) => {
  let error = req.flash().error || [];
  res.render("forgot-password", { error });
};

const forgot_password_validation = async (req, res) => {
  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: `helpfromautodrive@gmail.com`,
        pass: `AllAmerican2!`,
      },
    })
  );
  let query = await user.findOne({ email: req.body.email });
  if (query === null) {
    req.flash("error", "Email does not exist. Please try again.");
    res.redirect("/forgot-password");
  } else {
    const JWT_SECRET =
      "ZaLReWHDTMOxq7VGrDFCysCWf3WmlkiR4lRWc1bGCvgPkfzJJVYswbM7Dkn0vmEajhLPbxLuByDAgPc/2uQlQ==";
    const secret = JWT_SECRET;
    const payload = {
      email: query.email,
      id: query.username,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "5m" });
    query.updateOne({ resetlink: token }, (err) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/login");
      }
    });
    const link = `https://agile-temple-22703.herokuapp.com/reset-password/${token}`;
    try {
      var mailOptions = {
        from: `helpfromautodrive@gmail.com`,
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
