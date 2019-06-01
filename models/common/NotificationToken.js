var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var notificationToken = new Schema({
  userId:      { type: String },
  token:       { type: String },
  platform:    { type: String },
  createdDate: { type: Date, default: Date.now },
}, {
  collection: 'NotificationToken'
});

module.exports = mongoose.model('NotificationToken', notificationToken);