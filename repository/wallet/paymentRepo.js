((paymentRepo,
  Payment,
  paymentStatus,
  commonServ,
  Response,
  mongoose) => {

  paymentRepo.get = async (query, limit) => {
    try {
    const records = await Payment.find(query).limit(limit);
    let res = new Response();
    res = commonServ.handleRecordFound(res, records);
    res.output = records;
    } catch (err) {
      commonServ.handleErrorResponse(err);
    }
  };

  paymentRepo.getPopulated = async (query, limit) => {
    try {
      const records = await Payment.find(query)
        .limit(limit)
        .populate('service', 'name')
        .exec();
        let res = new Response();
      res = commonServ.handleRecordFound(res, records);
      res.output = records;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  paymentRepo.create = async (payments) => {
    try {  
      const inserted = await Payment.insertMany(payments);
      const res = new Response();
      res.output = inserted;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  paymentRepo.update = async (id, payment, cb) => {
    try {
      let query = { _id: mongoose.Types.ObjectId(id) };
      const updatedItem = await Payment.updateOne(query, payment);
      const res = new Response();
      res.output = updatedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
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