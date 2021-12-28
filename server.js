"use strict";
// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const ejs = require("ejs");
const logger = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const favicon = require("serve-favicon");

// ROUTES REQUIRED
const main = require("./routes/main.js");
const about = require("./routes/about.js");
const contact = require("./routes/contact.js");
const profile = require("./routes/profile.js");
const pricing = require("./routes/pricing.js");
const help = require("./routes/help.js");
const login = require("./routes/login.js");
const signup = require("./routes/signup.js");
const forgot_password = require("./routes/forgot-password.js");
const reset_password = require("./routes/reset-password.js");

// PORT
const port = 3000;
const app = express();

// VIEWS SETUP
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");
app.set("view cache", false);

// MIDDLEWARE
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static("public"));
app.use(flash());

// COOKIES AND SESSION
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// DATABASE
require("./config/database.js");

// PASSPORT AUTHENTICATION
require("./config/passport.js");

// ROUTES
app.use("/", main);
app.use("/about", about);
app.use("/contact", contact);
app.use("/pricing", pricing);
app.use("/profile", profile);
app.use("/help", help);
app.use("/login", login);
app.use("/signup", signup);
app.use("/forgot-password", forgot_password);
app.use("/reset-password", reset_password);
// Logout
app.get("/logout", async (req, res) => {
  req.flash("success", "You are logged out")
  res.clearCookie("connect.sid");
  req.logout();
  res.redirect("/");
});

app.listen(process.env.PORT || port, (err, done) => {
  if (!err) {
    console.log({ message: "success!" });
  } else {
    return err;
  }
});
