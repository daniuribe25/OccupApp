((userServicesRepo,
  UserService,
  Service,
  commonServ,
  mongoose) => {

  userServicesRepo.get = (query, limit, cb) => {
    UserService.find(query)
    .limit(limit)
    .populate({ path: 'user' })
    .populate('serviceMedia')
    .populate('service')
    .exec((err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    });
  };

  userServicesRepo.create = (userService, cb) => {
    let newService = new UserService();
    newService.service = userService.service;
    newService.description = userService.description;
    newService.user = userService.user;
    newService.isActive = userService.isActive;

    newService.save((err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  userServicesRepo.update = (id, userService, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    UserService.updateOne(query, userService, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  userServicesRepo.delete = (query, cb) => {
    UserService.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/service/UserService'),
  require('../../models/service/Service'),
  require('../../helpers/commonServices'),
  require('mongoose')
)