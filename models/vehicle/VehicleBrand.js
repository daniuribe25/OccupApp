var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleBrand = new Schema({
  name:        { type: String },
  vehicleCategoryId:  { type: String },
  isActive:    { type: Boolean },
}, {
  collection: 'VehicleBrand'
});

module.exports = mongoose.model('VehicleBrand', vehicleBrand);