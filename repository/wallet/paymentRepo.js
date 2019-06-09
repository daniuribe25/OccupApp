((paymentRepo,
  Payment,
  paymentStatus,
  commonServ,
  mongoose) => {

  paymentRepo.getPopulated = (query, limit, cb) => {
    Payment.find(query)
    .limit(limit)
    .populate('service', 'name')
    .exec((err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
  };

  paymentRepo.create = (payment, cb) => {
    let newPayment = new Payment();
    newPayment.service = payment.service;
    newPayment.value = payment.value;
    newPayment.status = paymentStatus.ON_WALLET;
    newPayment.sentBy = payment.sentBy;
    newPayment.receivedBy = payment.receivedBy;

    newPayment.save((err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  paymentRepo.update = (id, payment, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    Payment.updateOne(query, payment, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  paymentRepo.delete = (query, cb) => {
    Payment.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/wallet/Payment'),
  require('../../config/constants').paymentStatus,
  require('../../helpers/commonServices'),
  require('mongoose')
)