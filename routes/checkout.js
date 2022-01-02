"use strict";
var express = require("express");
var router = express.Router();
require("dotenv").config()
const checkoutController = require('../controllers/checkoutController')

router.get("/", checkoutController.checkout_index)

router.post("/create-payment", checkoutController.create_payment)

module.exports = router