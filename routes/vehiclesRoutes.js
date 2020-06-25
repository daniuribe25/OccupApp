var express  = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = (new Date().toISOString()).replace(/:/g, '-');
    cb(null, `${fileName}_${file.originalname}`)}
}) });

var vehiclesCtrl = require('../controllers/vehicle/vehiclesController');
var vehiclesRoutes = express.Router();

vehiclesRoutes.route('/ve_categories').get((req, res) => vehiclesCtrl.getList(req, res, 'category'));
vehiclesRoutes.route('/ve_brands/:categoryId').get((req, res) => vehiclesCtrl.getList(req, res, 'brand'));
vehiclesRoutes.route('/ve_references/:brandId').get((req, res) => vehiclesCtrl.getList(req, res, 'reference'));
vehiclesRoutes.route('/ve_section/:categoryId').get((req, res) => vehiclesCtrl.getList(req, res, 'section'));
vehiclesRoutes.route('/ve_item/:sectionId').get((req, res) => vehiclesCtrl.getList(req, res, 'item'));
vehiclesRoutes.route('/ve_save').post(upload.array('media'), vehiclesCtrl.create)

module.exports = vehiclesRoutes;