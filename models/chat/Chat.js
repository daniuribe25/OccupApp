var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var chat = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user1Id:     { type: String },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user2Id:     { type: String },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  isActive:  { type: Boolean, default: true },
}, {
  collection: 'Chats'
});

module.exports = mongoose.model('Chat', chat);