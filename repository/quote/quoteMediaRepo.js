((quoteMediaRepo,
  QuoteMedia,
  commonServ,
  mongoose,
  Response) => {

  quoteMediaRepo.get = (query, limit, cb) => {
    QuoteMedia.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
    .limit(limit);
  };

  quoteMediaRepo.create = async (images) => {
    try {
      const insertedItem = await QuoteMedia.insertMany(images);
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteMediaRepo.delete = async (query) => {
    try {
      const resp = await QuoteMedia.deleteMany(query);
      const res = new Response();
      res.output = resp;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../models/quote/QuoteMedia'),
  require('../../helpers/commonServices'),
  require('mongoose'),
  require('../../dtos/Response'),
)