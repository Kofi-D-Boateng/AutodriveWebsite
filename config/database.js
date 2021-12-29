require("dotenv").config();
var mongoose = require("mongoose");

require("dotenv").config();

let dbConnect = mongoose.connect(
  "mongodb+srv://autodrive-admin-1:lamarrazorback2!@autodriveone.70icx.mongodb.net/userDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

require("../models/user.js");

module.exports = dbConnect;
