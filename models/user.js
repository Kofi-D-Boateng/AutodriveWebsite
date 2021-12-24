"use-strict";
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
require("../config/database");

const userSchema = new mongoose.Schema(
  {
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
    company: { type: String, trim: true, validate: /^\w/ },
    position: { type: String, trim: true, validate: /^\w/ },
    location: { type: String, trim: true, validate: /^[A-Za-z]/ },
    password: {
      type: String,
      trim: true,
      validate: /^\w/,
    },
    purchases: [
      {
        order: String,
        duration: String,
        asset: String,
        name: String,
      },
    ],
    phone: { type: String, trim: true, validate: /^\d{10}$/ },
    userimage: { type: String, default: "c2d993a9788cf64656ec07b7079177ea" },
    googleId: String,
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
