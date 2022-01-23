var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.TEAM_EMAIL,
      pass: process.env.TEAM_EMAIL_CREDENTIALS,
    },
  })
);

module.exports = mailer = (decodedData) => {
  const timestamp = new Date().toLocaleDateString();
  var mailOptions = {
    from: "no-reply",
    to: `${decodedData.email}`,
    subject: `Thank you for purchasing through Autodrive!`,
    text: `Thank you ${decodedData.name} for ordering through Autodrive! 
                          Your order of ${decodedData.order} for ${decodedData.duration} months on ${timestamp} was processed. 
                          A representative from our team will reach out to you momentarily!


                          Autodrive
                          Arlington, Texas`,
  };
  transport.sendMail(mailOptions, (err) => {
    if (!err) {
      return;
    } else {
      console.log(err.message);
      return;
    }
  });
};
