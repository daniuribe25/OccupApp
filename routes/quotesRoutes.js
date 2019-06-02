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

var quoteCtrl = require('../controllers/quote/quoteController');
var routerQuote = express.Router();

routerQuote.route('/quote')
    .get(quoteCtrl.getAll)
    .post(upload.array('quoteMedia'), quoteCtrl.create);

routerQuote.route('/quote/:id')
    .patch(quoteCtrl.update)
    .delete(quoteCtrl.delete);

routerQuote.route('/user_quote_full/:user').get(quoteCtrl.getByUser);
routerQuote.route('/user_quote/:user').get(quoteCtrl.getWithServiceByUser);

module.exports = routerQuote;