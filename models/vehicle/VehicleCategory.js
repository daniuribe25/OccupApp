var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleCategory = new Schema({
  name:        { type: String },
  isActive:    { type: Boolean },
}, {
  collection: 'VehicleCategory'
});

module.exports = mongoose.model('VehicleCategory', vehicleCategory);