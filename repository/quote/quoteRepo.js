((quoteRepo,
  Quote,
  quoteStatus,
  commonServ,
  mongoose) => {

  quoteRepo.getPopulated = (query, limit, cb) => {
    Quote.find(query)
    .limit(limit)
    .populate('sentBy', 'name lastName')
    .populate('receivedBy', 'name lastName')
    .populate('quoteMedia', 'mediaUrl type')
    .populate('service', 'name')
    .exec((err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
  };

  quoteRepo.getWithService = (query, limit, cb) => {
    Quote.find(query)
      .limit(limit)
      .populate('service', 'name')
      .exec((err, records) => {
        let res = commonServ.handleErrorResponse(err);
        commonServ.handleRecordFound(res, records);
        res.output = records;
        cb(res);
    });
  };

  quoteRepo.get = (query, limit, cb) => {
    Quote.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    }).limit(limit);
  };

  quoteRepo.create = (quote, cb) => {
    let newQuote = new Quote();
    newQuote.service = quote.service;
    newQuote.description = quote.description;
    newQuote.location = quote.location;
    newQuote.dateTime = quote.dateTime;
    newQuote.status = quoteStatus.SENT;
    newQuote.sentBy = quote.sentBy;
    newQuote.receivedBy = quote.receivedBy;

    newQuote.save((err, insertedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = insertedItem;
      cb(res);
    });
  };

  quoteRepo.update = (id, quote, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    Quote.updateOne(query, quote, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  quoteRepo.delete = (query, cb) => {
    Quote.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/quote/Quote'),
  require('../../config/constants').quoteStatus,
  require('../../helpers/commonServices'),
  require('mongoose')
)