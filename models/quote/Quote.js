var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var quote = new Schema({
  dateTime:    { type: Date },
  description: { type: String },
  location:    { type: String },
  status:       { type: String },
  observation: { type: String },
  price:       { type: Number },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  serviceId:    { type: String },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sentById:   { type: String },
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedById: { type: String },
  quoteMedia:  [{
    type: Schema.Types.ObjectId,
    ref: 'QuoteMedia',
  }],
  isActive:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: new Date() },
}, {
  collection: 'Quote'
});

module.exports = mongoose.model('Quote', quote);