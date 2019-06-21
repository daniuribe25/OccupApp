((notificationTokenRepo,
  NotificationToken,
  commonServ,
  mongoose) => {

  notificationTokenRepo.get = (query, limit, cb) => {
    NotificationToken.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    });
  };

  notificationTokenRepo.create = (notificationToken, cb) => {
    let newNT = new NotificationToken();
    newNT.userId = notificationToken.userId;
    newNT.token = notificationToken.token;
    newNT.platform = notificationToken.platform;

    newNT.save((err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  notificationTokenRepo.update = (id, notificationToken, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    NotificationToken.updateOne(query, notificationToken, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };
  
  notificationTokenRepo.upsert = (query, newData, cb) => {
    NotificationToken.findOneAndUpdate(query, newData, {upsert:true}, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  notificationTokenRepo.delete = (query, cb) => {
    NotificationToken.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/common/NotificationToken'),
  require('../../helpers/commonServices'),
  require('mongoose')
)