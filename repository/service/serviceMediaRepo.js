((serviceMediaRepo,
  ServiceMedia,
  commonServ,
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

  serviceMediaRepo.create = (images, cb) => {
    const serviceMedia = [];
    images.forEach((i) => {
      serviceMedia.push({
        service: i.service,
        type: i.type,
        mediaUrl: i.mediaUrl,
      });
    });

    ServiceMedia.insertMany(serviceMedia, (err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  serviceMediaRepo.delete = (query, cb) => {
    ServiceMedia.deleteMany(query, (err) => {
      const res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/service/ServiceMedia'),
  require('../../helpers/commonServices'),
  require('mongoose')
)