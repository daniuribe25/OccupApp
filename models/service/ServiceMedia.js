var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var serviceMedia = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  mediaUrl: { type: String },
  type: { type: String },
}, {
  collection: 'ServiceMedia'
});

module.exports = mongoose.model('ServiceMedia', serviceMedia);