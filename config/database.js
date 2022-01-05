require("dotenv").config();
var mongoose = require("mongoose");

let dbConnect = mongoose.connect(
  process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

require("../models/user.js");

module.exports = dbConnect;