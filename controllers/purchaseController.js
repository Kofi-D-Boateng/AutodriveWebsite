"use strict";
var User = require("../models/user");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();
const {
  MongoClient
} = require("mongodb");
const url = process.env.MONGO_CLIENT_DB
const dbName = process.env.MONGO_CLIENT_DB

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
      if (storeConnection != null) {
        storeConnection.findOne({
          name: newPurchase.order
        }, (err, result) => {
          if (!err) {

            if (result["name"] == "Cyber Security") {
              console.log("WE MADE IT IN FIRST LOGIC LOOP")
              try {
                if (result["duration"] != newPurchase["duration"] || result["stock"] != newPurchase["asset"]) {
                  let amount = result["price"]
                  if (result["duration"] <= newPurchase["duration"]) {
                    let duration = amount * newPurchase["duration"]
                    console.log('\n' + duration + '\n')
                  }
                  if (result["stock"] <= newPurchase["asset"]) {
                    let asset = amount + 15 * (newPurchase["asset"] - result["stock"])
                    console.log('\n' + asset + '\n')
                  }
                }
              } catch (error) {
                console.log(error)
              }
            } else if (result["name"] == "Machine Learning") {
              console.log(JSON.stringify(result))
              console.log("WE MADE IT IN SECOND LOGIC LOOP")
              try {
                if (result["duration"] != newPurchase["duration"] || result["stock"] != newPurchase["asset"]) {
                  let amount = result["price"]
                  if (result["duration"] <= newPurchase["duration"]) {
                    let duration = amount * newPurchase["duration"]
                    console.log('\n' + duration + '\n')
                  }
                  if (result["stock"] <= newPurchase["asset"]) {
                    if (newPurchase["asset"] % 300 != 1) {
                      let asset = amount * (newPurchase["asset"] / 300)
                      console.log('\n' + asset + '\n')
                    }
                  }
                }
              } catch (error) {
                console.log(error)
              }
            } else if (result["name"] != "Machine Learning" && "Cyber Security") {
              console.log("WE MADE IT IN THIRD LOGIC LOOP")
              let amount = result["price"]
              console.log(JSON.stringify(result))
              try {
                if (result["name"] == "Back End") {
                  if (result["duration"] < newPurchase["duration"]) {
                    let price = amount + (30 * newPurchase["duration"])
                    console.log(price)
                  }
                } else if (result["name"] == "Front End" || result["name"] == "Full Stack") {
                  if (result["stock"] < newPurchase["asset"]) {
                    let price = amount + (100 * newPurchase["asset"])
                    console.log(price)
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }
          }
        })
      }
    })
    User.findById(req.user.id, (err, foundUser) => {
      if (foundUser && !err) {
        foundUser.purchases.push(newPurchase);
        foundUser.save((err) => {
          if (!err) {
            try {
              var mailOptions = {
                from: process.env.TEAM_EMAIL,
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
            req.flash(
              "error",
              "There was an error with your purchase. Please try again!"
            );
            res.redirect("pricing")
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