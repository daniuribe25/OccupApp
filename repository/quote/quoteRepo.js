((quoteRepo,
  Quote,
  quoteStatus,
  commonServ,
  mongoose,
  Response) => {

  quoteRepo.getPopulated = async (query, limit) => {
    try {
      const records = await Quote.find(query)
        .limit(limit)
        .populate('sentBy', 'name lastName')
        .populate('receivedBy', 'name lastName')
        .populate('quoteMedia', 'mediaUrl type')
        .populate('service', 'name')
        .exec();
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteRepo.getWithUsers = async (query, limit) => {
    try {
      const records = await Quote.find(query)
        .limit(limit)
        .populate('sentBy', 'name lastName profileImage')
        .populate('receivedBy', 'name lastName profileImage')
        .exec();
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteRepo.getWithService = async (query, limit) => {
    try {
      const records = await Quote.find(query)
        .limit(limit)
        .populate('service', 'name')
        .exec();
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteRepo.get = async (query, limit) => {
    try {
      const records = await Quote.find(query).limit(limit);;
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
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
  require('mongoose'),
  require('../../dtos/Response'),
)