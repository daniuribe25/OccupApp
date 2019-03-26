var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var serviceCategory = new Schema({
  name:        { type: String },
  isActive:    { type: Boolean },
}, {
  collection: 'ServiceCategories'
});

module.exports = mongoose.model('ServiceCategory', serviceCategory);