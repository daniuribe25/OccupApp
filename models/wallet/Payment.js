var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var payment = new Schema({
  dateTime:    { type: Date, default: new Date() },
  status:      { type: String },
  value:       { type: Number },
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
  isActive:    { type: Boolean, default: true },
}, {
  collection: 'Payments'
});

module.exports = mongoose.model('Payment', payment);