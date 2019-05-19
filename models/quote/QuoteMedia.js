var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var serviceMedia = new Schema({
  quote: {
    type: Schema.Types.ObjectId,
    ref: 'Quote',
  },
  mediaUrl: { type: String },
  type: { type: String },
}, {
  collection: 'QuoteMedia'
});

module.exports = mongoose.model('QuoteMedia', serviceMedia);