"use-strict";
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
require("../config/database");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    validate: /^\w/,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate: /^\w/,
  },
  company: {
    type: String,
    trim: true,
    validate: /^\w/,
    default: null
  },
  position: {
    type: String,
    trim: true,
    validate: /^\w/,
    default: null
  },
  location: {
    type: String,
    trim: true,
    validate: /^[A-Za-z]/,
    default: null,
  },
  password: {
    type: String,
    trim: true,
    validate: /^\w/,
  },
  purchases: [{
    order: String,
    duration: Number,
    asset: Number,
    name: String,
  }, ],
  userimage: {
    type: String,
    default: process.env.PROFILE_PIC_KEY
  },
  googleId: String,
  resetlink: {
    type: String,
    default: ""
  },
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);