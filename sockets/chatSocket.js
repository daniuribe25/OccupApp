((chatSocket, chatRepo) => {

	chatSocket.saveMessage = async (socket, mobileSockets, { text, user, user2, createdAt, chatId }) => {
		const messageResp = await chatRepo.addMessage(chatId, { text, createdAt, user	});
		console.log('mobileSockets: ', mobileSockets);
		console.log('user1: ', user);
		console.log('user2: ', user2);
		console.log('message: ', text);
		// emit response to sender
		socket.emit('incomingMessage', { user, user2,  messageResp, chatId, sender: true });
		// emit response to receiver

		
		socket.to(mobileSockets[user2]).emit('incomingMessage', { user, user2, messageResp, chatId, sender: false });
	};

})(
	module.exports,
	require('../repository/chat/chatRepo'),
)