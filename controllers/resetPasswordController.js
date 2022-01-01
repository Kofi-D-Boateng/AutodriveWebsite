"use strict";
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const reset_password_index = async (req, res) => {
  const {
    token
  } = req.params;
  if (!token) {
    req.flash("error", "The link you clicked on is invalid.");
    res.redirect("/");
    return;
  } else {
    const secret = process.env.JWT_SECRET
    jwt.verify(token, secret, (err, decodedData) => {
      if (!err) {
        let verifiedUser = decodedData.id;
        const error = req.flash().error || [];
        res.render("reset-password", {
          token,
          error,
          username: verifiedUser
        });
      } else {
        res.send(
          "There was an error with the link. Please request another one."
        );
      }
    });
  }
};

const reset_password_validation = async (req, res) => {
  const {
    username,
    newPassword,
    confirmedPassword
  } = req.body;
  let query = await User.findOne({
    username: username
  });
  // CHECK FOR USERNAME SPRAY & MISMATCH PASSWORD
  jwt.verify(
    query.resetlink,
    process.env.JWT_SECRET,
    async (err) => {
      if (err) {
        req.flash("error", err);
        res.redirect(`/reset-password/${query.resetlink}`);
      } else if (newPassword !== confirmedPassword) {
        req.flash("error", "PASSWORDS DO NOT MATCH");
        res.redirect(`/reset-password/${query.resetlink}`);
      } else {
        try {
          let savedUser = await query.setPassword(newPassword);
          await savedUser.save();
          req.flash(
            "success",
            "Password was successfully changed. Please login"
          );
          res.redirect("/login");
        } catch (error) {
          req.flash(
            "error",
            "There was an error updating your password please try again."
          );
          res.redirect(`/reset-password/${query.resetlink}`);
        }
      }
    }
  );
};

module.exports = {
  reset_password_index,
  reset_password_validation,
};