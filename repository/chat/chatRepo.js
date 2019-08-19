((chatRepo,
  Messages,
  Chat,
  commonServ,
  Response,
  mongoose) => {

  chatRepo.findOrCreate = async (chat) => {
    try {
      const query = { "$or" : [
        { "$and": [ { user1Id: chat.user1 }, { user2Id: chat.user2 } ] },
        { "$and": [ { user1Id: chat.user2 }, { user2Id: chat.user1 } ] },
      ]};
      const records = await Chat.find(query).limit(1);
      const res = new Response();
      if (!records.length) {
        let newChat = new Chat();
        newChat.user1 = chat.user1;
        newChat.user1Id = chat.user1;
        newChat.user2 = chat.user2;
        newChat.user2Id = chat.user2;
        newChat.messages = [];
        const insertedItem = await newChat.save();
        res.output = insertedItem;
        return res;
      } else {
        if (!records[0].isActive) {
          records[0].isActive = true;
          await Chat.update({ _id: records[0].id }, records[0]);
        }
      }
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  chatRepo.getPopulated = async (query, limit) => {
    try {
      const records = await Chat.find(query)
        .limit(limit)
        .populate('messages', 'text timestamp userId')
        .populate('user1', 'name lastName profileImage')
        .populate('user2', 'name lastName profileImage')
        .exec();
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  chatRepo.update = (id, chat, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    Chat.updateOne(query, chat, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  chatRepo.delete = (query, cb) => {
    Chat.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/chat/Message'),
  require('../../models/chat/Chat'),
  require('../../helpers/commonServices'),
  require('../../dtos/Response'),
  require('mongoose')
)