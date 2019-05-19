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
  rating:       { type: String, default: "5.0" },
  isActive:    { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
}, {
  collection: 'UserService'
});

module.exports = mongoose.model('UserService', userService);