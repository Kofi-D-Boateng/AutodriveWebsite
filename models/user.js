"use-strict";

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;

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
        amount: String,
      },
    ],
    phone: { type: String, trim: true, validate: /^\d{10}$/ },
    userimage: String,
    googleId: String,
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
