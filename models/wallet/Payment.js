var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var payment = new Schema({
  dateTime:      { type: Date, default: new Date() },
  status:        { type: String },
  topic:         { type: String },
  transactionId: { type: String },
  paymentStatus: { type: String },
  amount:        { type: Number },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  sentByEmail: { type: String }, 
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receivedByEmail: { type: String },
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive:    { type: Boolean, default: true },
}, {
  collection: 'Payments'
});

module.exports = mongoose.model('Payment', payment);