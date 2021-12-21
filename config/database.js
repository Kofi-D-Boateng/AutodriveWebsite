require("dotenv").config();
var mongoose = require("mongoose");
const { db } = require("../models/user");
require("dotenv").config();

let dbConnect = mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require("../models/user.js");

module.exports = dbConnect;
