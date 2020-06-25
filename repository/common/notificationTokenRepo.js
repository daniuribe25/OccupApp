((notificationTokenRepo,
  NotificationToken,
  commonServ,
  mongoose,
  Response) => {

  notificationTokenRepo.get = async (query, limit, cb) => {
    try {
      const records = await NotificationToken.find(query).limit(limit);
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
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
  require('mongoose'),
  require('../../dtos/Response'),
)