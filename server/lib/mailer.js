var nodemailer = require('nodemailer');

// options: smtp, user, password
function Mailer(options) {
  this.transportUrl = 'smtp://'
    + encodeURIComponent(options.user)
    + ':'
    + options.password
    + '@'
    + options.smtp;

  this.user = options.user;
}

Mailer.prototype = {
  // options: from, to, subject, html, text
  send(options) {
    var transporter = nodemailer.createTransport(this.transportUrl);
    var mailOptions;

    // setup e-mail data with unicode symbols
    mailOptions = {
      from: options.from || this.user,
      to: options.to,
      subject: options.subject,
    };

    if (options.html) mailOptions.html = options.html;
    if (options.text) mailOptions.text = options.text;

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
}

module.exports = Mailer;
