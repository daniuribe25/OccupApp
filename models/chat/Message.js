var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var message = new Schema({
  text:     { type: String },
  createdAt:   { type: Date },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userId:     { type: String },
}, {
  collection: 'Messages'
});

module.exports = mongoose.model('Message', message);