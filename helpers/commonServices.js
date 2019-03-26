((commonServices, nodemailer, Response) => {

  commonServices.handleErrorResponse = (err) => {
    let res = new Response();
    if (err) {
      res.success = false;
      res.message = err;
    }
    return res;
  };

  commonServices.handleRecordFound = (response, result) => {
    if (result) {
      if (!result.length) {
        response.success = false;
        response.message = "Not found";
      }
    }
  };

  commonServices.sendEmail = (subject, from, to, html, text, cb ) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'Gmail',
        auth: {
            user: 'dani.uribe25@gmail.com', // Your email id
            pass: 'iamthebest123' // Your password
        }
    });
    var mailOptions = { from, to, subject, text, html };
    transporter.sendMail(mailOptions, function (error, info) {
      let result = {};
        if (error) {
            console.log(error);
            result = {
                state:"error",
                message:error
            };
        } else {
            console.log('Message sent: ' + info.response);
            result = {
                state:"ok",
                message:info.response
            };
        };
        cb(result);
    });
};

})(
  module.exports,
  require('nodemailer'),
  require('../dtos/Response')
)