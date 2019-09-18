var express  = require("express");

var paymentsCtrl = require('../controllers/wallet/paymentController');
var routerPayments = express.Router();

routerPayments.route('/payments')
    .get(paymentsCtrl.getAll)
    .post(paymentsCtrl.updatePayment);

routerPayments.route('/user_payments/:user').get(paymentsCtrl.getById);
routerPayments.route('/get_last/:user').get(paymentsCtrl.getLastByUser);
routerPayments.route('/disbursPayments/:id').get(paymentsCtrl.disbursPayments);

module.exports = routerPayments;