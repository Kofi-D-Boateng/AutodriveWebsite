"use strict";
var express = require("express");
var router = express.Router();
require("dotenv").config();

const {
  create_stripe_session,
  checkout_index,
} = require("../controllers/checkoutController");

router.get("/:token", checkout_index);
router.post("/create-stripe-session", create_stripe_session);

module.exports = router;
