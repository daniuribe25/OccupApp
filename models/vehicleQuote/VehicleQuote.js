var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleQuote = new Schema({
  description: { type: String },
  categoryId: { type: String },
  brandId: { type: String },
  referenceId: { type: String },
  sectionId: { type: String },
  itemId: { type: String },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory'
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleBrand'
  },
  reference: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleReference'
  },
  model: { type: String },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleSection'
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleItem'
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sentById:   { type: String },
  quoteMedia:  [{
    type: Schema.Types.ObjectId,
    ref: 'VehicleQuoteMedia',
  }],
  isActive:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: new Date() },
}, {
  collection: 'VehicleQuote'
});

module.exports = mongoose.model('VehicleQuote', vehicleQuote);