((chatRepo,
  Chat,
  commonServ,
  mongoose) => {

  chatRepo.getPopulated = (query, limit, cb) => {
    Payment.find(query)
    .limit(limit)
    .populate('sentBy', 'name lastName profileImage')
    .populate('receivedBy', 'name lastName profileImage')
    .exec((err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    })
  };

  chatRepo.findOrcreate = async (chat) => {
    try {
      let newChat = new Chat();
      newChat.text = chat.text;
      newChat.timestamp = chat.timestamp;
      newChat.user = chat.user;
      newChat.userBy = chat.userBy;

      const insertedItem = await newChat.save();
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  chatRepo.update = (id, chat, cb) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    Payment.updateOne(query, chat, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  chatRepo.updateMany = (query, set, cb) => {
    Payment.updateMany(query, set, (err, updatedItem) => {
      let res = commonServ.handleErrorResponse(err);
      res.output = updatedItem;
      cb(res);
    });
  };

  chatRepo.delete = (query, cb) => {
    Payment.deleteOne(query, (err) => {
      let res = commonServ.handleErrorResponse(err);
      cb(res);
    });
  };

 })(
  module.exports,
  require('../../models/chat/Chat'),
  require('../../helpers/commonServices'),
  require('mongoose')
)