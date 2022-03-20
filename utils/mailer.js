const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.TEAM_EMAIL,
      pass: process.env.TEAM_EMAIL_CREDENTIALS,
    },
  })
);

const purchaseMailer = (decodedData) => {
  const timestamp = new Date().toLocaleDateString();
  const mailOptions = {
    from: "no-reply",
    to: `${decodedData.email}`,
    subject: `Thank you for purchasing through Autodrive!`,
    text: `Thank you ${decodedData.name} for ordering through Autodrive! 
                          Your order of ${decodedData.order} for ${decodedData.duration} months on ${timestamp} was processed. 
                          A representative from our team will reach out to you momentarily!


                          Autodrive
                          Arlington, Texas`,
  };
  try {
    transport.sendMail(mailOptions, (err) => {
      if (!err) {
        return;
      } else {
        console.log(err.message);
        return;
      }
    });
  } catch (error) {}
};

const resetMailer = (link) => {
  var mailOptions = {
    from: process.env.TEAM_EMAIL,
    to: `${query["email"]}`,
    subject: `Password Reset`,
    text: `A password reset request has been initiated by your account. Below is the link to reset your password.
              link: ${link}

              Autodrive
              Arlington, Texas`,
  };
  try {
    transport.sendMail(mailOptions, (err, info) => {
      if (!err) {
        return;
      } else {
        console.log(err.message);
        return;
      }
    });
  } catch (error) {}
};

module.exports = {
  purchaseMailer,
  resetMailer,
};
