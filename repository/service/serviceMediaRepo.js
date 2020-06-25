((serviceMediaRepo,
  ServiceMedia,
  commonServ,
  Response,
  mongoose) => {

  serviceMediaRepo.get = (query, limit, cb) => {
    ServiceMedia.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
    .limit(limit);
  };

  serviceMediaRepo.create = async (images) => {
    const serviceMedia = [];
    images.forEach((i) => {
      serviceMedia.push({
        service: i.service,
        type: i.type,
        mediaUrl: i.mediaUrl,
        publicId: i.publicId,
      });
    });

    try {
      const insertedItem = await ServiceMedia.insertMany(serviceMedia);
      let res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  serviceMediaRepo.delete = async (query) => {
    try {
      await ServiceMedia.deleteMany(query);
      return new Response();
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../models/service/ServiceMedia'),
  require('../../helpers/commonServices'),
  require('../../dtos/Response'),
  require('mongoose')
)