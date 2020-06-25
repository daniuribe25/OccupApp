var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var vehicleReference = new Schema({
  name:            { type: String },
  vehicleBrandId:  { type: String },
  isActive:        { type: Boolean },
}, {
  collection: 'VehicleReference'
});

module.exports = mongoose.model('VehicleReference', vehicleReference);