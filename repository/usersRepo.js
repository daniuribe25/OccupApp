((userRepo,
  User,
  commonServ,
  mongoose,
  Response) => {

  userRepo.get = async (query, limit) => {
    try {
      const records = await User.find(query).limit(limit)
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  userRepo.create = async (user) => {
    try{
      let newUser = new User();
      newUser.password = user.password;
      newUser.email = user.email;
      newUser.name = user.name;
      newUser.lastName = user.lastName;
      newUser.birthday = user.birthday;
      newUser.cel = user.cel;
      newUser.loginType = user.loginType;
      newUser.profileImage = user.profileImage;
      
      const insertedItem = await newUser.save();
      const res = new Response();
      res.output = insertedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  userRepo.update = async (id, user) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    try {
      const updatedItem = await User.updateOne(query, user)
      const res = new Response();
      res.output = updatedItem;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

  userRepo.delete = async (id) => {
    let query = { _id: mongoose.Types.ObjectId(id) };
    try {
      await User.deleteOne(query)
      const res = new Response();
      res.output = id;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../models/common/User'),
  require('../helpers/commonServices'),
  require('mongoose'),
  require('../dtos/Response'),
)