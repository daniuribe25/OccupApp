((vehicleRepo,
  commonServ,
  Response,
  mongoose) => {

  vehicleRepo.get = async (query, Model) => {
    try {
      const records = await Model.find(query)
      const res = new Response();
      res.output = records;
      return res;
    } catch (err) {
      return commonServ.handleErrorResponse(err);
    }
  };

 })(
  module.exports,
  require('../../helpers/commonServices'),
  require('../../dtos/Response'),
  require('mongoose')
)