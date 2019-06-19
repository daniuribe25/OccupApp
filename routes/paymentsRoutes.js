var express  = require("express");

var paymentsCtrl = require('../controllers/wallet/paymentController');
var routerPayments = express.Router();

routerPayments.route('/payments')
    .get(paymentsCtrl.getAll)
    .post(paymentsCtrl.create)

routerPayments.route('/user_payments/:user').get(paymentsCtrl.getByUser);
routerPayments.route('/disbursPayments/:id').get(paymentsCtrl.disbursPayments);

module.exports = routerPayments;