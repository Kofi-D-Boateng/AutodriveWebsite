"use strict";
const jwt = require("jsonwebtoken");
var user = require("../models/user");
const { resetMailer } = require("../utils/mailer");

const forgot_password_index = (req, res) => {
  let error = req.flash().error || [];
  res.render("forgot-password", {
    error,
  });
};

const forgot_password_validation = async (req, res) => {
  let query = await user.findOne({
    email: req.body.email,
  });
  if (query === null) {
    req.flash("error", "Email does not exist. Please try again.");
    res.redirect("/forgot-password");
  } else {
    const JWT_SECRET = process.env.JWT_SECRET;
    const secret = JWT_SECRET;
    const payload = {
      email: query.email,
      id: query.username,
    };
    const token = jwt.sign(payload, secret, {
      expiresIn: "5m",
    });
    query.updateOne(
      {
        resetlink: token,
      },
      (err) => {
        if (err) {
          req.flash("error", err);
          res.redirect("/login");
        }
      }
    );
    const link = process.env.HOSTED_LINK;
    try {
      resetMailer(link);
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
