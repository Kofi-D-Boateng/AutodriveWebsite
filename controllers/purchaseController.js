"use strict";
var User = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();

const purchase_index = async (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("pricing", { navbar: navbarLoggedIn });
  } else {
    res.render("pricing", { navbar: navbar });
  }
};

const purchased_item = async (req, res) => {
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
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    let newPurchase = {
      order: req.body.order,
      duration: req.body.duration,
      asset: req.body.asset,
      name: req.body.fullName,
      email: req.body.email,
      timestamp: req.user.updatedAt,
    };
    console.log(newPurchase);
    User.findById(req.user.id, (err, foundUser) => {
      if (foundUser && !err) {
        foundUser.purchases.push(newPurchase);
        foundUser.save((err) => {
          if (!err) {
            try {
              var mailOptions = {
                from: `${process.env.PURCHASE_EMAIL}`,
                to: `${newPurchase.email}`,
                subject: `Thank you for purchasing through Autodrive!`,
                text: `Thank you ${newPurchase.name} for ordering through Autodrive! 
              Your order of ${newPurchase.order} for ${newPurchase.duration} on ${newPurchase.timestamp} was processed. 
              A representative from our team will reach out to you momentarily!


              Autodrive
              Arlington, Texas`,
              };
              transport.sendMail(mailOptions, (err, info) => {
                if (!err) {
                  console.log("Email sent to" + info.response);
                }
              });
            } catch (error) {
              throw error;
            }
            req.flash("success", "Purchases was a success!");
            res.redirect("/");
          } else {
            let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
            req.flash(
              "error",
              "There was an error with your purchase. Please try again!"
            );
            res.render("pricing", { navbar: navbarLoggedIn });
          }
        });
      }
    });
  }
};

module.exports = {
  purchase_index,
  purchased_item,
};
