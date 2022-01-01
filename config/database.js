require("dotenv").config();
var mongoose = require("mongoose");

require("dotenv").config();

let dbConnect = mongoose.connect(
  process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

require("../models/user.js");

module.exports = dbConnect;