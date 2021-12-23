var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.PURCHASE_EMAIL,
      pass: process.env.TEAM_EMAIL_CREDENTIALS,
    },
  })
);
