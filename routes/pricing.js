var express = require("express");
var router = express.Router();
var User = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const rateLimiter = require("express-rate-limit");

// Rate-limiting ruleset
const accountPurchaseLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many Purchase attempts. Please try again later.",
});

router.get("/", function (req, res) {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("pricing", { navbar: navbarLoggedIn });
  } else {
    res.render("pricing", { navbar: navbar });
  }
});

// PURCHASING AND RECEIPT
router.post("/purchased", accountPurchaseLimiter, async (req, res) => {
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

  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    console.log("WE HAVE HIT THE POST ROUTE");
    let newPurchase = {
      order: req.body.order,
      duration: req.body.duration,
      asset: req.body.asset,
      name: req.body.fullName,
      timestamp: req.user.updatedAt,
    };
    console.log(newPurchase);
    User.findById(req.user.id, (err, foundUser) => {
      if (foundUser && !err) {
        foundUser.purchases.push(newPurchase);
        foundUser.save((err) => {
          if (!err) {
            // RECEIPT
            try {
              var mailOptions = {
                from: `${process.env.PURCHASE_EMAIL}`,
                to: `${req.user.email}`,
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
});

module.exports = router;
