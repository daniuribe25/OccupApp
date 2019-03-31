((userRepo,
  User,
  commonServ,
  mongoose) => {

  userRepo.get = (query, limit, cb) => {
    User.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    }).limit(limit);
  };

  userRepo.create = (user, cb) => {
    let newUser = new User();
    newUser.password = user.password;
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.lastName = user.lastName;
    newUser.birthday = user.birthday;
    newUser.docType = user.docType;
    newUser.document = user.document;
    newUser.cel = user.cel;

    newUser.save((err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  userRepo.update = (id, user, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    User.updateOne(query, user, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  userRepo.delete = (id, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    User.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = id;
      cb(res);
    });
  };

 })(
  module.exports,
  require('../models/common/User'),
  require('../helpers/commonServices'),
  require('mongoose')
)