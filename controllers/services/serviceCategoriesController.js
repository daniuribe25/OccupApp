((serviceCategoriesCtrl, serviceCategoriesRepo) => {

  serviceCategoriesCtrl.getAll = (req, res) => {
    serviceCategoriesRepo.get({ isActive: { $ne: false }}, 0, (response) => {
        res.json(response);
    });
  }

  serviceCategoriesCtrl.getByCategory = (req, res) => {
    const query = { $and: [{ serviceCategoryId: req.params.id }, { isActive: { $ne: false }} ]};
    serviceCategoriesRepo.getByCategory(query, 0, (response) => {
        res.json(response);
    });
  }
  

 })(
  module.exports,
  require('../../repository/service/serviceCategoriesRepo'),
)