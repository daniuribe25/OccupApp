var express  = require("express");

var userServicesCtrl = require('../controllers/services/userServicesController');
var routerUserService = express.Router();

routerUserService.route('/user_services')
    .get(userServicesCtrl.getAll)
    .post(userServicesCtrl.create);

routerUserService.route('/user_services/:id')
    .get(userServicesCtrl.getById)
    .patch(userServicesCtrl.update)
    .delete(userServicesCtrl.delete);

routerUserService.route('/getByUser/:userId').get(userServicesCtrl.getByUser)
routerUserService.route('/disable_service/:id').patch(userServicesCtrl.disableService)

module.exports = routerUserService;