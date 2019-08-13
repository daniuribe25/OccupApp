var express  = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${new Date().valueOf()}_${file.originalname}`)}
  }) });

var userServicesCtrl = require('../controllers/services/userServicesController');
var routerUserService = express.Router();

routerUserService.route('/user_services')
    .get(userServicesCtrl.getAll)
    .post(upload.array('serviceMedia'), userServicesCtrl.create)
    .patch(upload.array('serviceMedia'), userServicesCtrl.update);

routerUserService.route('/user_services/:id')
    .get(userServicesCtrl.getById)
    .delete(userServicesCtrl.delete);

routerUserService.route('/getByUser/:userId').get(userServicesCtrl.getByUser)
routerUserService.route('/disable_service/:id').patch(userServicesCtrl.disableService)

module.exports = routerUserService;