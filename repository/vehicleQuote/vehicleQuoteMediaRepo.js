((quoteMediaRepo,
  VehicleQuoteMedia,
  commonServ,
  mongoose,
  Response) => {

  quoteMediaRepo.get = (query, limit, cb) => {
    VehicleQuoteMedia.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
    .limit(limit);
  };

  quoteMediaRepo.create = async (images) => {
    try {
      const insertedItem = await VehicleQuoteMedia.insertMany(images);
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteMediaRepo.delete = async (query) => {
    try {
      const resp = await VehicleQuoteMedia.deleteMany(query);
      const res = new Response();
      res.output = resp;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../models/vehicleQuote/VehicleQuoteMedia'),
  require('../../helpers/commonServices'),
  require('mongoose'),
  require('../../dtos/Response'),
)