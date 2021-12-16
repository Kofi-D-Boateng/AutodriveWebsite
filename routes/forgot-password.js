var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("forgot-password");
});

module.exports = router;
