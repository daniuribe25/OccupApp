var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var quote = new Schema({
  dateTime:    { type: Date },
  description: { type: Boolean },
  location:    { type: String },
  state:       { type: String },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  quoteMedia:  [{
    type: Schema.Types.ObjectId,
    ref: 'QuoteMedia',
  }],
  isActive:    { type: Boolean, default: true },
}, {
  collection: 'Quote'
});

module.exports = mongoose.model('Quote', quote);