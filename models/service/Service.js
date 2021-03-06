var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var service = new Schema({
  name:        { type: String },
  serviceCategory:  {
    type: Schema.Types.ObjectId,
    ref: 'ServiceCategory'
  },
  serviceCategoryId:  { type: String },
  isActive:    { type: Boolean },
}, {
  collection: 'Services'
});

module.exports = mongoose.model('Service', service);