var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleQuoteMedia = new Schema({
  quote: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleQuote',
  },
  mediaUrl: { type: String },
  type: { type: String },
}, {
  collection: 'VehicleQuoteMedia'
});

module.exports = mongoose.model('VehicleQuoteMedia', vehicleQuoteMedia);