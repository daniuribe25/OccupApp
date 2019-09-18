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

  paymentCtrl.getLastByUser = async (req, res) => {
    const date = getUTCDate(-5); // Colombian tz
    const gte = new Date(new Date(date.getTime()).setMinutes(date.getMinutes() - 1));
    const { user } = req.params;
    const query = { $or: [
      { $and: [
        { receivedByEmail: user },
        { paymentStatus: 'approved' },
        { dateTime: {
          $gte: gte,
          $lt: date
        }}
      ]},
      { $and: [
        { topic: 'merchant_order' },
        { paymentStatus: 'opened' },
        { dateTime: {
          $gte: gte,
          $lt: date
        }}
      ]}
    ]};
    const response = await paymentRepo.get(query, 0)
    res.json(response);
  }

  getUTCDate = (tz) => {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const colUTC = utc + (3600000*(tz));
    return new Date(colUTC);
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

  paymentCtrl.updatePayment = async (req, res) => {
    const { body } = req;
    const { id } = req.params;

    const paymentResponse = await paymentRepo.update(id, body);
    if (paymentResponse.success) {
      sendPaymentEmail(id, 'dani.uribe25@gmail.com');
    }
    res.json(paymentResponse);
  }

  const sendPaymentEmail = (pId, to) => {
    const htmlContent = `<p>Payment ID: ${pId}<p>`;

    commonServ.sendEmail(
      'Nuevo pago Occupapp',
      'dani.uribe25@gmail.com', to,
      htmlContent, '',
      (result) => result
    );
  };

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
    const { body } = req;
    try {
      const preferences = await mercadopago.preferences.create({
        items: [
          {
            id: new Date().getUTCMilliseconds(),
            title: body.title,
            quantity: 1,
            currency_id: 'COP',
            unit_price: body.unit_price,
          }
        ],
        payer: {
          email: body.email,
          name: body.name,
          surname: body.surname,
          date_created: new Date(),
          phone: {
            area_code: "+57",
            number: body.phone
          }
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
    if (merchantOrder.body.payments.length) {
      merchantOrder.body.payments.forEach((p) => {
        payments.push({
          topic: req.query.topic,
          transactionId: req.query.id,
          paymentStatus: p.status,
          amount: p.transaction_amount,
          sentByEmail: p.payer.email,
          dateTime: getUTCDate(-5),
        });
      });
    } else {
      payments.push({
        topic: req.query.topic,
        transactionId: req.query.id,
        paymentStatus: merchantOrder.body.status,
        amount: merchantOrder.body.total_amount,
        dateTime: merchantOrder.body.date_created,
      });
    }

    await paymentRepo.create(payments);
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