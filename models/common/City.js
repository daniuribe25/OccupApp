var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var city = new Schema({
  name:        { type: String },
  isActive:    { type: Boolean },
}, {
  collection: 'Cities'
});

module.exports = mongoose.model('City', city);