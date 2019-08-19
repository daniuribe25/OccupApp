const express  = require("express");
const chatCtrl = require('../controllers/chat/chatController');
const routerChat = express.Router();

routerChat.route('/chat/:user1/:user2').get(chatCtrl.getByUsers);
routerChat.route('/chats/:user').get(chatCtrl.getChatsByUser);

module.exports = routerChat;