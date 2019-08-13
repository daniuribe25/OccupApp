const mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

const userService = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  serviceId:   { type: String },
  description: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userId:       { type: String },
  serviceMedia: [{
    type: Schema.Types.ObjectId,
    ref: 'ServiceMedia'
  }],
  rating:       { type: String, default: "5.0" },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: new Date() },
}, {
  collection: 'UserService'
});

module.exports = mongoose.model('UserService', userService);