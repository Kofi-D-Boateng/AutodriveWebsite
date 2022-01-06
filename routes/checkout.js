"use strict";
var express = require("express");
var router = express.Router();
require("dotenv").config()
const checkoutController = require('../controllers/checkoutController')

router.get("/:token", checkoutController.checkout_index)

router.post("/create-payment", checkoutController.create_paypal_payment)

router.post("/create-stripe-session", checkoutController.create_stripe_session)

module.exports = router