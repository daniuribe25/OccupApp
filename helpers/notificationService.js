var https = require('https');

class NotificationService {

  send(data, cb, cbError) {
    var headers = { "Content-Type": "application/json; charset=utf-8" };
    
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    
    var requ = https.request(options, function(res) {  
      res.on('data', cb);
    });

    requ.on('error', cbError);
    
    requ.write(JSON.stringify(data));
    requ.end();
  }
  
}

module.exports = new NotificationService;