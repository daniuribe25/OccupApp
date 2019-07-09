((serviceCategoriesRepo,
  ServiceCategory,
  Service,
  commonServ) => {

  serviceCategoriesRepo.get = (query, limit, cb) => {
    ServiceCategory.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    });
  };

  serviceCategoriesRepo.getByCategory = (query, limit, cb) => {
    Service.find(query, (err, records) => {
      let res = commonServ.handleErrorResponse(err);
      commonServ.handleRecordFound(res, records);
      res.output = records;
      cb(res);
    });
  };
  

 })(
  module.exports,
  require('../../models/service/ServiceCategory'),
  require('../../models/service/Service'),
  require('../../helpers/commonServices'),
)