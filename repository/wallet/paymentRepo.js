((paymentRepo,
  Payment,
  paymentStatus,
  commonServ,
  Response,
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

  paymentRepo.create = async (payments) => {
    try {  
      const inserted = await Payment.insertMany(payments);
      console.log(inserted)
      const res = new Response();
      res.output = inserted;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  paymentRepo.update = (id, payment, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    Payment.updateOne(query, payment, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  paymentRepo.updateMany = (query, set, cb) => {
    Payment.updateMany(query, set, (err, updatedItem) => {
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
  require('../../dtos/Response'),
  require('mongoose')
)