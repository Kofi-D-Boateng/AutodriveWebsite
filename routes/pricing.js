var express = require("express");
var router = express.Router();

var User = require("../models/user");

router
  .get("/", function (req, res) {
    let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
    let navbar = "partials/navbar.ejs";
    if (req.isAuthenticated()) {
      res.render("pricing", { navbar: navbarLoggedIn });
    } else {
      res.render("pricing", { navbar: navbar });
    }
  })
  .post("/purchased", function (req, res) {
    if (!req.isAuthenticated()) {
      res.redirect("/login");
    } else {
      console.log("WE HAVE HIT THE POST ROUTE");
      let newPurchase = {
        order: req.body.order,
        amount: req.body.amount,
      };
      console.log(newPurchase);
      let id = req.user.id;
      User.findById(id, (err, foundUser) => {
        if (foundUser && !err) {
          foundUser.purchases.push(newPurchase);
          foundUser.save((err) => {
            if (!err) {
              let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
              console.log("SUCCESS!");
              res.redirect("/");
            } else {
              let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
              console.log("FAILED \n" + err);
              res.render("pricing", { navbar: navbarLoggedIn });
            }
          });
        }
      });
    }
  });

module.exports = router;
