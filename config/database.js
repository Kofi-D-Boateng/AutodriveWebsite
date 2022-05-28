"use strict";
require("dotenv").config();
var mongoose = require("mongoose");

let dbConnect = mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = dbConnect;
