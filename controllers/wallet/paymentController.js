((paymentCtrl, paymentRepo, mongoose, notificationService,
  notificationTokenRepo, pushActions, paymentStatus, Response) => {

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

  paymentCtrl.disbursPayments = (req, res) => {
    const query = { $and: [
      { receivedBy: mongoose.Types.ObjectId(req.params.id) },
      { status: paymentStatus.ON_WALLET }
    ]};
    paymentRepo.updateMany(query, { status: paymentStatus.PAY_PENDING }, (response) => {
      res.json(response)
    });
  }

  paymentCtrl.setPaymentPreferences = async (req, res, mercadopago) => {
    const response = new Response();
    try {
      const preferences = await mercadopago.preferences.create({
        items: [
          {
            id: '1234',
            title: 'Small Aluminum Shirt',
            quantity: 1,
            currency_id: 'COP',
            unit_price: 12000
          }
        ],
        payer: {
          email: 'dani.uribe16@gmail.com',
          name: "Charles",
          surname: "Santana",
          date_created: "2019-06-02T12:58:41.425-04:00",
          phone: {
            area_code: "+57",
            number: 9233412363
          },
          identification: {
            type: "DNI",
            number: "12345678"
          },
        }
      });
      response.output = preferences.body.init_point;
      res.json(response);
    } catch (err) {
      response.message = err;
      response.success = false;
      res.json(response);
    }
  }

  paymentCtrl.paymentNotification = async (req, res, mercadopago) => {
    console.log('query payment::', req.query, req.body);
    let payment = null;
    let merchantOrder = null;
    switch (req.query.topic) {
      case 'payment':
        payment = await mercadopago.payment.findById(req.query.id);
        console.log('PAGO== ', payment);
        merchantOrder = await mercadopago.merchant_orders.findById(payment.orderId);
        break
      case 'merchant_order':
        merchantOrder = await mercadopago.merchant_orders.findById(req.query.id);
        console.log('ORDEN== ', merchantOrder);
        break
    }

    const payments = [];
    merchantOrder.body.payments.forEach((p) => {
      payments.push({
        topic: req.query.topic,
        transactionId: req.query.id,
        paymentStatus: p.status,
        amount: p.transaction_amount,
        sentByEmail: p.payer.email,
        dateTime: p.date_approved,
      });
    });

    const resp = await paymentRepo.create(payments);
    console.log(resp);
    res.sendStatus(200);
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
  require('../../config/constants').paymentStatus,
  require('../../dtos/Response'),
)