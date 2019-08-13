const express  = require("express");
const chatCtrl = require('../controllers/chat/chatController');
const routerChat = express.Router();

routerChat.route('/chat')
    .get(chatCtrl.getWithUsers);

module.exports = routerChat;