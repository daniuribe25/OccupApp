var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var chat = new Schema({
  text:     { type: String },
  timestamp:   { type: Number },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userId:     { type: String },
}, {
  collection: 'Chats'
});

module.exports = mongoose.model('Chat', chat);