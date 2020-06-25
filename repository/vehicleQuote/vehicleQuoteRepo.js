((vehicleQuoteRepo,
  VehicleQuote,
  quoteStatus,
  commonServ,
  mongoose,
  Response) => {

  vehicleQuoteRepo.getPopulated = async (query, limit) => {
    try {
      const records = await VehicleQuote.find(query)
        .limit(limit)
        .populate('sentBy', 'name lastName email')
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

  vehicleQuoteRepo.getWithUsers = async (query, limit) => {
    try {
      const records = await VehicleQuote.find(query)
        .limit(limit)
        .populate('sentBy', 'name lastName profileImage email')
        .populate('receivedBy', 'name lastName profileImage email')
        .exec();
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  vehicleQuoteRepo.getWithService = async (query, limit) => {
    try {
      const records = await VehicleQuote.find(query)
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

  vehicleQuoteRepo.get = async (query, limit) => {
    try {
      const records = await VehicleQuote.find(query).limit(limit);;
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  // Used
  vehicleQuoteRepo.create = async (quote) => {
    let newQuote = new VehicleQuote();
    newQuote.description = quote.description;
    newQuote.sentBy = quote.sentBy;
    newQuote.sentById = quote.sentBy;

    newQuote.model = quote.model;
    newQuote.categoryId = quote.category;
    newQuote.brandId = quote.brand;
    newQuote.referenceId = quote.reference;
    newQuote.sectionId = quote.section;
    newQuote.itemId = quote.item;
    newQuote.category = quote.category;
    newQuote.brand = quote.brand;
    newQuote.reference = quote.reference;
    newQuote.section = quote.section;
    newQuote.item = quote.item;
    try {
      const insertedItem = await newQuote.save();
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  // used
  vehicleQuoteRepo.update = async (id, quote) => {
    try {
      let query = { _id: mongoose.Types.ObjectId(id) };
      const updatedItem = await VehicleQuote.updateOne(query, quote);
      const res = new Response();
      res.output = updatedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../models/vehicleQuote/VehicleQuote'),
  require('../../config/constants').quoteStatus,
  require('../../helpers/commonServices'),
  require('mongoose'),
  require('../../dtos/Response'),
)