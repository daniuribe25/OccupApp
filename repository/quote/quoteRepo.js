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

  quoteRepo.create = async (quote) => {
    let newQuote = new Quote();
    newQuote.service = quote.service;
    newQuote.serviceId = quote.service;
    newQuote.description = quote.description;
    newQuote.location = quote.location;
    newQuote.dateTime = quote.dateTime;
    newQuote.status = quoteStatus.SENT;
    newQuote.sentBy = quote.sentBy;
    newQuote.receivedBy = quote.receivedBy;
    newQuote.sentById = quote.sentBy;
    newQuote.receivedById = quote.receivedBy;
    try {
      const insertedItem = await newQuote.save();
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteRepo.update = async (id, quote) => {
    try {
      let query = { _id: mongoose.Types.ObjectId(id) };
      const updatedItem = await Quote.updateOne(query, quote);
      const res = new Response();
      res.output = updatedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  quoteRepo.delete = async (query) => {
    try {
      const resp = await Quote.deleteOne(query);
      const res = new Response();
      res.output = resp;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../models/quote/Quote'),
  require('../../config/constants').quoteStatus,
  require('../../helpers/commonServices'),
  require('mongoose'),
  require('../../dtos/Response'),
)