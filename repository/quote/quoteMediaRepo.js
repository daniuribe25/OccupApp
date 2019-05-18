((quoteMediaRepo,
  QuoteMedia,
  commonServ,
  mongoose) => {

  quoteMediaRepo.get = (query, limit, cb) => {
    QuoteMedia.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
    .limit(limit);
  };

  quoteMediaRepo.create = (images, cb) => {
    QuoteMedia.insertMany(images, (err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  quoteMediaRepo.delete = (query, cb) => {
    QuoteMedia.deleteMany(query, (err) => {
      const res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/quote/QuoteMedia'),
  require('../../helpers/commonServices'),
  require('mongoose')
)