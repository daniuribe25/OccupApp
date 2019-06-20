((userServicesRepo,
  UserService,
  serviceCategory,
  Service,
  commonServ,
  mongoose) => {

  userServicesRepo.getPopulated = (query, limit, cb) => {
    UserService.find(query)
    .limit(limit)
    .populate('user', 'name lastName')
    .populate('serviceMedia', 'mediaUrl type')
    .populate({
      path: 'service',
      select: 'name serviceCategory',
      populate: { path: 'serviceCategory', select: 'name' },
    })
    .exec((err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = formatUserServices(records);
      cb(res);
    });
  };

  userServicesRepo.get = (query, limit, cb) => {
    UserService.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    });
  };

  formatUserServices = (userServices) => {
    return userServices.map(x => ({
      userId: x.user._id,
      name: `${x.user.name} ${x.user.lastName}`,
      serviceId: x.service._id,
      service: x.service.name,
      category: x.service.serviceCategory.name,
      media: x.serviceMedia.map(m => m.mediaUrl),
      rating: x.rating,
      description: x.description,
    }))
  }

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
  require('../../models/service/ServiceCategory'),
  require('../../helpers/commonServices'),
  require('mongoose')
)