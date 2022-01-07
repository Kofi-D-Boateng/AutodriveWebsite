"use strict";
var User = require("../models/user");
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
        const webDevPrice = []
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
              res.redirect("purchase")
            }
          } else if (result["name"] == "Machine Learning") {
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
              res.redirect("purchase")
            }
          } else if (result["name"] != "Machine Learning" && "Cyber Security") {
            const amount = result["price"]
            try {
              if (result["name"] == "Back End") {
                if (result["duration"] < newPurchase["duration"]) {
                  const price = amount + (30 * newPurchase["duration"])
                  webDevPrice.push(price)

                } else {
                  webDevPrice.push(amount)
                }
              } else if (result["name"] == "Front End" || result["name"] == "Full Stack") {
                if (result["stock"] < newPurchase["asset"]) {
                  const price = amount + (100 * newPurchase["asset"])
                  webDevPrice.push(price)
                } else {
                  webDevPrice.push(amount)
                }
              }
            } catch (error) {
              console.log(error)
              res.redirect("purchase")
            }
          }
        }
        const totalPrice = webDevPrice.length ? webDevPrice[0] : (priceAdjustment[0] + priceAdjustment[1])
        const USD = webDevPrice.length ? formatter.format(webDevPrice) : formatter.format(totalPrice)
        const payload = {
          name: newPurchase.name,
          email: newPurchase.email,
          user: req.user.username,
          order: newPurchase.order,
          duration: newPurchase.duration,
          asset: newPurchase.asset,
          displayprice: USD,
          price: totalPrice

        };
        const token = jwt.sign(payload, secret, {
          expiresIn: "20min"
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
  }
};

module.exports = {
  purchase_index,
  purchased_item,
};