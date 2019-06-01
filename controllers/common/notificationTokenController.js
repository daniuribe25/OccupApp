((notificationTokenCtrl, notificationTokenRepo, mongoose) => {

  notificationTokenCtrl.getAll = (req, res) => {
    notificationTokenRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  notificationTokenCtrl.getById = (req, res) => {
    const { id } = req.params;
    notificationTokenRepo.get({ _id: mongoose.Types.ObjectId(id) }, 1, (response) => {
      if (response.output.length) response.output = response.output[0];
      res.json(response);
    });
  }

  notificationTokenCtrl.create = (req, res) => {
    const newNT = req.body;
    notificationTokenRepo.create(newNT, (servResponse) => {
      res.json(servResponse);
    });
  }

 })(
  module.exports,
  require('../../repository/common/notificationTokenRepo'),
  require('mongoose'),
)