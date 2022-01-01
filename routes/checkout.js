"use strict";
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("checkout")
})

module.exports = router