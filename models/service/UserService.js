const mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

const userService = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  description: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  serviceMedia: [{
    type: Schema.Types.ObjectId,
    ref: 'ServiceMedia'
  }],
  score:       { type: Number, min: 1, max: 5, default: 5 },
  isActive:    { type: Boolean },
  createdDate: { type: Date, default: Date.now },
}, {
  collection: 'UserServices'
});

module.exports = mongoose.model('UserService', userService);