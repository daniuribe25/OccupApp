var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleSection = new Schema({
  name:              { type: String },
  vehicleCategoryId:  { type: String },
  isActive:           { type: Boolean },
}, {
  collection: 'VehicleSection'
});

module.exports = mongoose.model('VehicleSection', vehicleSection);