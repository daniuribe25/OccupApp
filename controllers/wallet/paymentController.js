((paymentCtrl, paymentRepo, mongoose, notificationService,
  notificationTokenRepo, pushActions) => {

  paymentCtrl.getAll = (req, res) => {
    paymentRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  paymentCtrl.getById = (req, res) => {
    paymentRepo.getPopulated({ _id: mongoose.Types.ObjectId(req.params.id) }, 1, (response) => {
      if (response.output.length) response.output = response.output[0];
      res.json(response);
    });
  }

  paymentCtrl.getByUser = (req, res) => {
    const { user } = req.params;
    const query = { receivedBy: mongoose.Types.ObjectId(user) };
    paymentRepo.getPopulated(query, 0, (response) => {
      res.json(response);
    });
  }

  paymentCtrl.sendPaymentNotification = (userId, title, message, action, id) => {
    notificationTokenRepo.get({ userId }, 1, (response) => {
      if (response.success) {
        var data = {
          app_id: "368c949f-f2ef-4905-8c78-4040697f38cf",
          contents: { en: message },
          headings: { en: title },
          template_id: '1bc00fbd-1b9a-4f5f-abdd-83f48a0418cf',
          include_player_ids: [response.output[0].token],
          data: { action, id }
        };
    
        notificationService.send(data, () => {}, (e) => {
          console.log(JSON.parse(e))
        });
      }
    });
  }

  paymentCtrl.create = (req, res) => {
    const { body } = req;
    paymentRepo.create(body, (paymentResponse) => {
      if (paymentResponse.success) {
        this.sendPaymentNotification(body.receivedBy, "Felicitaciones!",
          "Has recibido una nuevo pago por tu buen servicio",
          pushActions.ON_WALLET, paymentResponse.output._id);
      }
      res.json(paymentResponse);
    });
  }

  paymentCtrl.delete = (req, res) => {
    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    paymentRepo.delete(query, (response) => {
      if (response.success) {
        paymentMediaRepo.delete({ payment: mongoose.Types.ObjectId(req.params.id) },
          (deleteMediaResponse) => {
            if (deleteMediaResponse.success) {
              res.json(response);
            }
        });
      }
    });
  }

 })(
  module.exports,
  require('../../repository/wallet/paymentRepo'),
  require('mongoose'),
  require('../../helpers/notificationService'),
  require('../../repository/common/notificationTokenRepo'),
  require('../../config/constants').pushActions,
)