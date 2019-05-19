var express  = require("express");

var quoteCtrl = require('../controllers/quote/quoteController');
var routerQuote = express.Router();

routerQuote.route('/quote')
    .get(quoteCtrl.getAll)
    .post(quoteCtrl.create);

routerQuote.route('/quote/:id')
    .get(quoteCtrl.getById)
    .patch(quoteCtrl.update)
    .delete(quoteCtrl.delete);

module.exports = routerQuote;