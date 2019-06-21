((notificationTokenCtrl, notificationTokenRepo, mongoose) => {

  notificationTokenCtrl.getAll = (req, res) => {
    notificationTokenRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  notificationTokenCtrl.registerToken = (req, res) => {
    const device_token = {
      userId: req.body.userId,
      token: req.body.token,
      platform: req.body.platform,
    }
    notificationTokenRepo.upsert({ userId: req.body.userId }, device_token, (servResponse) => {
      res.json(servResponse);
    });
  }

 })(
  module.exports,
  require('../../repository/common/notificationTokenRepo'),
  require('mongoose'),
)