((chatCtrl, chatRepo) => {

  chatCtrl.getByUsers = async (req, res) => {
    const { user1, user2 } = req.params;
    const query = { "$or" : [
      { "$and": [ { user1Id: user1 }, { user2Id: user2 } ] },
      { "$and": [ { user1Id: user2 }, { user2Id: user1 } ] },
    ]};
    const response = await chatRepo.getPopulated(query, 1);
    res.json(response);
  }

  chatCtrl.getChatsByUser = async (req, res) => {
    const { user } = req.params;
    const query = { '$and': [
      {"$or": [{ user1Id: user }, { user2Id: user }]},
      { isActive: { $ne: false }}
    ]};
    const response = await chatRepo.getPopulated(query, 0);
    res.json(response);
  }

 })(
  module.exports,
  require('../../repository/chat/chatRepo'),
)