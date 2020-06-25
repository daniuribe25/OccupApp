var express  = require("express");

var paymentsCtrl = require('../controllers/wallet/paymentController');
var routerPayments = express.Router();

routerPayments.route('/payments')
    .get(paymentsCtrl.getAll);

routerPayments.route('/user_payments/:user').get(paymentsCtrl.getById);
routerPayments.route('/disbursPayments/:id').get(paymentsCtrl.disbursPayments);
routerPayments.route('/update_payment/:email').post(paymentsCtrl.updatePayment);

module.exports = routerPayments;