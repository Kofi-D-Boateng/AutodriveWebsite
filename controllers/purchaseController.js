"use strict";
var User = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();
const {
  MongoClient
} = require("mongodb");
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})
const url = process.env.MONGO_CLIENT_DB
const dbName = process.env.MONGO_CLIENT_DBNAME
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET
const secret = JWT_SECRET;


const purchase_index = async (req, res) => {
  let navbarLoggedIn = "partials/loggedIn-navbar.ejs";
  let navbar = "partials/navbar.ejs";
  if (req.isAuthenticated()) {
    res.render("pricing", {
      navbar: navbarLoggedIn
    });
  } else {
    res.render("pricing", {
      navbar: navbar
    });
  }
};

const purchased_item = async (req, res) => {
  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.TEAM_EMAIL,
        pass: process.env.TEAM_EMAIL_CREDENTIALS
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
    const mongoClient = new MongoClient(url)
    const storeConnection = mongoClient.connect(async (err, client) => {
      const db = client.db(dbName)
      const storeConnection = db.collection("stores")
      storeConnection.findOne({
        name: newPurchase.order
      }, async (err, result) => {
        const priceAdjustment = []
        if (!err) {
          if (result["name"] == "Cyber Security") {
            try {
              if (result["duration"] != newPurchase["duration"] || result["stock"] != newPurchase["asset"]) {
                const amount = result["price"]
                if (result["duration"] <= newPurchase["duration"]) {
                  const duration = amount * newPurchase["duration"]
                  priceAdjustment.push(duration)
                }
                if (result["stock"] <= newPurchase["asset"]) {
                  const asset = amount + 15 * (newPurchase["asset"] - result["stock"])
                  priceAdjustment.push(asset)
                }
              }
            } catch (error) {
              console.log(error)
            }
          } else if (result["name"] == "Machine Learning") {
            console.log("WE MADE IT IN SECOND LOGIC LOOP")
            try {
              if (result["duration"] != newPurchase["duration"] || result["stock"] != newPurchase["asset"]) {
                const amount = result["price"]
                if (result["duration"] <= newPurchase["duration"]) {
                  const duration = amount * newPurchase["duration"]
                  priceAdjustment.push(duration)
                }
                if (result["stock"] <= newPurchase["asset"]) {
                  if (newPurchase["asset"] % 300 != 1) {
                    const asset = amount * (newPurchase["asset"] / 300)
                    priceAdjustment.push(asset)
                  }
                }
              }
            } catch (error) {
              console.log(error)
            }
          } else if (result["name"] != "Machine Learning" && "Cyber Security") {
            console.log("WE MADE IT IN THIRD LOGIC LOOP")
            const amount = result["price"]
            try {
              if (result["name"] == "Back End") {
                if (result["duration"] < newPurchase["duration"]) {
                  const price = amount + (30 * newPurchase["duration"])
                  const USD = formatter.format(price)
                  console.log(USD)
                }
              } else if (result["name"] == "Front End" || result["name"] == "Full Stack") {
                if (result["stock"] < newPurchase["asset"]) {
                  const price = amount + (100 * newPurchase["asset"])
                  const USD = formatter.format(price)
                  console.log(USD)
                }
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
        const totalPrice = (priceAdjustment[0] + priceAdjustment[1])
        const USD = formatter.format(totalPrice)
        const payload = {
          email: newPurchase.email,
          user: req.user.username,
          order: newPurchase.order,
          duration: newPurchase.duration,
          asset: newPurchase.asset,
          price: USD

        };
        const token = jwt.sign(payload, secret, {
          expiresIn: "1hr"
        });
        let query = await User.findById(req.user.id)
        let query_result = await query.updateOne({
          purchaseToken: token
        })
        if (query_result !== null) {
          res.redirect(`../checkout/${token}`)
        } else {
          req.flash("error", "Your purchase did not go through. Please try again!")
          res.redirect("purchase")
        }
      })
    })
    // User.findById(req.user.id, (err, foundUser) => {
    //   if (foundUser && !err) {
    //     foundUser.purchases.push(newPurchase);
    //     foundUser.save((err) => {
    //       if (!err) {
    //         // try {
    //         //   var mailOptions = {
    //         //     from: process.env.TEAM_EMAIL,
    //         //     to: `${newPurchase.email}`,
    //         //     subject: `Thank you for purchasing through Autodrive!`,
    //         //     text: `Thank you ${newPurchase.name} for ordering through Autodrive! 
    //         //   Your order of ${newPurchase.order} for ${newPurchase.duration} on ${newPurchase.timestamp} was processed. 
    //         //   A representative from our team will reach out to you momentarily!


    //         //   Autodrive
    //         //   Arlington, Texas`,
    //         //   };
    //         //   transport.sendMail(mailOptions, (err, info) => {
    //         //     if (!err) {
    //         //       console.log("Email sent to" + info.response);
    //         //     }
    //         //   });
    //         // } catch (error) {
    //         //   throw error;
    //         // }
    //         req.flash("success", "Purchases was a success!");
    //         res.redirect("/");
    //       } else {
    //         req.flash(
    //           "error",
    //           "There was an error with your purchase. Please try again!"
    //         );
    //         res.redirect("pricing")
    //       }
    //     });
    //   }
    // });
  }
};

module.exports = {
  purchase_index,
  purchased_item,
};