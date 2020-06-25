var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var serviceMedia = new Schema({
  userService: {
    type: Schema.Types.ObjectId,
    ref: 'UserService',
  },
  mediaUrl: { type: String },
  publicId: { type: String },
  type: { type: String },
}, {
  collection: 'ServiceMedia'
});

module.exports = mongoose.model('ServiceMedia', serviceMedia);