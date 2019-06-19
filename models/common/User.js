var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var user = new Schema({
  email:       { type: String },
  password:    { type: String },
  name:        { type: String },
  lastName:    { type: String },
  birthday:    { type: Date },
  docType:     { type: String },
  document:    { type: String },
  cel:         { type: String },
  profileImage:{ type: String },
  loginType:   { type: String },
  location:  { 
    type: Schema.Types.ObjectId,
    ref: 'City'
  },
  daviplata:   { type: String },
  createdDate: { type: Date, default: Date.now },
}, {
  collection: 'Users'
});

module.exports = mongoose.model('User', user);