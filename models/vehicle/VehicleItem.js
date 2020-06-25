var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleItem = new Schema({
  name:               { type: String },
  vehicleSectionId:     { type: String },
  isActive:           { type: Boolean },
}, {
  collection: 'VehicleItem'
});

module.exports = mongoose.model('VehicleItem', vehicleItem);