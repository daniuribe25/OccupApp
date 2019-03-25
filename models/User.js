var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var user = new Schema({
  email:     { type: String },
  password:  { type: String },
  name:      { type: String },
  lastName:  { type: String },
  birthday:  { type: Date },
  docType:   { type: String },
  document:  { type: String },
  cel:       { type: String },
});

module.exports = mongoose.model('User', user);