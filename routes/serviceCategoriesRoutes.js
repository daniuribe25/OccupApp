var express  = require("express");

var serviceCategoriesCtrl = require('../controllers/services/serviceCategoriesController');
var routerServiceCategory = express.Router();

routerServiceCategory.route('/service_category')
    .get(serviceCategoriesCtrl.getAll)

routerServiceCategory.route('/services_by_category/:id')
    .get(serviceCategoriesCtrl.getByCategory)

module.exports = routerServiceCategory;