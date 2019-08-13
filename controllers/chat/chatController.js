((chatCtrl, chatRepo, quoteRepo, mongoose) => {

  chatCtrl.getAll = (req, res) => {
    chatRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  chatCtrl.getWithUsers =  async (req, res) => {
    const response = await quoteRepo.getWithUsers({ _id: mongoose.Types.ObjectId(req.params.id) }, 0)
    res.json(response);
  }

  chatCtrl.getByUser = (req, res) => {
    const { user } = req.params;
    const query = { receivedBy: mongoose.Types.ObjectId(user) };
    chatRepo.getPopulated(query, 0, (response) => {
      res.json(response);
    });
  }

  chatCtrl.create = (req, res) => {
    const { body } = req;
    chatRepo.create(body, (chatResponse) => {
      if (chatResponse.success) {
        this.sendPaymentNotification(body.receivedBy, "Felicitaciones!",
          "Has recibido una nuevo pago por tu buen servicio",
          pushActions.ON_WALLET, chatResponse.output._id);
      }
      res.json(chatResponse);
    });
  }

  chatCtrl.disbursPayments = (req, res) => {
    const query = { $and: [
      { receivedBy: mongoose.Types.ObjectId(req.params.id) },
      { status: chatStatus.ON_WALLET }
    ]};
    chatRepo.updateMany(query, { status: chatStatus.PAY_PENDING }, (response) => {
      res.json(response)
    });
  }
  

  chatCtrl.delete = (req, res) => {
    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    chatRepo.delete(query, (response) => {
      if (response.success) {
        chatMediaRepo.delete({ chat: mongoose.Types.ObjectId(req.params.id) },
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
  require('../../repository/chat/chatRepo'),
  require('../../repository/quote/quoteRepo'),
  require('mongoose'),
)