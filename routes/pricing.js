var express = require("express");
var router = express.Router();
const rateLimiter = require("express-rate-limit");
const purchaseController = require("../controllers/purchaseController");

// Rate-limiting ruleset
const accountPurchaseLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, //10 minutes
  max: 5, //MAXIMUM request for all users to API/All routes (DDoS prohibitor)
  message: "Too many Purchase attempts. Please try again later.",
});

router.get("/", purchaseController.purchase_index);

// PURCHASING AND RECEIPT
router.post(
  "/purchased",
  accountPurchaseLimiter,
  purchaseController.purchased_item
);

module.exports = router;
