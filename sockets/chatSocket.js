((chatSocket, chatRepo) => {

	chatSocket.saveMessage = async (socket, mobileSockets, { text, user, user2, createdAt, chatId }) => {
		const messageResp = await chatRepo.addMessage(chatId, { text, createdAt, user	});
		// emit response to sender
		socket.emit('incomingMessageChat', { user, user2,  messageResp, chatId, sender: true });
		// emit response to receiver
		const resp = { user, user2, messageResp, chatId, sender: false };
		socket.to(mobileSockets[user2]).emit('incomingMessageApp', resp);
		socket.to(mobileSockets[user2]).emit('incomingMessageList', resp);
		socket.to(mobileSockets[user2]).emit('incomingMessageChat', resp);
	};

})(
	module.exports,
	require('../repository/chat/chatRepo'),
)