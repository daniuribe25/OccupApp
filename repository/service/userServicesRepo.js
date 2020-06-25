((userServicesRepo,
  UserService,
  serviceCategory,
  Service,
  commonServ,
  Response,
  mongoose) => {

  userServicesRepo.getPopulated = async (query, limit) => {
    try {
      const records = await UserService.find(query)
        .limit(limit)
        .populate('user', 'name lastName email')
        .populate('serviceMedia', 'mediaUrl type publicId')
        .populate({
          path: 'service',
          select: 'name serviceCategory',
          populate: { path: 'serviceCategory', select: 'name' },
        })
        .exec();
      const res = new Response();
      res.output = formatUserServices(records);
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  userServicesRepo.get = async (query) => {
    try {
      const records = await UserService.find(query)
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  formatUserServices = (userServices) => {
    return userServices.map(x => ({
      _id: x._id,
      userId: x.user._id,
      name: `${x.user.name} ${x.user.lastName}`,
      serviceId: x.service._id,
      service: x.service.name,
      category: x.service.serviceCategory.name,
      categoryId: x.service.serviceCategory._id,
      media: x.serviceMedia.map(m => ({ url: m.mediaUrl, publicId: m.publicId })),
      rating: x.rating,
      description: x.description,
      isActive: x.isActive,
    }))
  }

  userServicesRepo.create = async (userService) => {
    try {
      let newService = new UserService();
      newService.service = userService.service;
      newService.description = userService.description;
      newService.user = userService.user;
      newService.userId = userService.user;
      newService.isActive = true;

      const insertedItem = await newService.save();
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  }

  userServicesRepo.update = async (id, userService) => {
    try {
      const query = { _id: mongoose.Types.ObjectId(id) };
      const updatedItem = await UserService.updateOne(query, userService);
      const res = new Response();
      res.output = updatedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  userServicesRepo.delete = async (query) => {
    try {
      const resp = await UserService.deleteOne(query);
      const res = new Response();
      res.output = resp;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../models/service/UserService'),
  require('../../models/service/Service'),
  require('../../models/service/ServiceCategory'),
  require('../../helpers/commonServices'),
  require('../../dtos/Response'),
  require('mongoose')
)