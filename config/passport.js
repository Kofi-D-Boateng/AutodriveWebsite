require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
let User = require("../models/user");

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
      userProfileURL: process.env.GOOGLE_CLIENT_PROFILE,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({
        googleId: profile.id
      }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);