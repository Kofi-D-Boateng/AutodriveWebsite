"use strict";
require("dotenv").config();
const jwt = require("jsonwebtoken");

const mailer = require("../utils/mailer");

const checkout_index = (req, res) => {
  const { token } = req.params;
  if (!token) {
    req.flash("error", "The link you clicked on is invalid.");
    res.redirect("/");
  } else {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret, (err, decodedData) => {
      if (!err) {
        const error = req.flash().error || [];
        res.render("checkout", {
          token,
          productOrder: decodedData["order"],
          purchaseDuration: decodedData.duration,
          purchaseAsset: decodedData.asset,
          purchaseTotal: decodedData.displayprice,
          paypal: process.env.PAYPAL_CLIENT_ID,
        });
      } else {
        res.send(
          "There was an error with the link. Please request another one."
        );
      }
    });
  }
};

const create_stripe_session = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_CREDENTIALS);
  const secret = process.env.JWT_SECRET;
  const token = req.user.purchaseToken;
  const decodedData = jwt.verify(token, secret);
  const order = decodedData.order.trim();
  const totalAmount = decodedData.price.toFixed(2);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: order,
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}/login`,
    });
    res.json({
      url: session["url"],
    });
    req.flash("success", "Your payment was successful.");
    setTimeout(() => {
      mailer(decodedData);
      req.flash("success", "Your purchase was successful");
    }, 10000);
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

module.exports = {
  checkout_index,
  create_stripe_session,
};
