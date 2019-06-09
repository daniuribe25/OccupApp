var express  = require("express");

var paymentsCtrl = require('../controllers/wallet/paymentController');
var routerPayments = express.Router();

routerPayments.route('/payments')
    .get(paymentsCtrl.getAll)
    .post(paymentsCtrl.create)

routerPayments.route('/user_payments/:user').get(paymentsCtrl.getByUser);

module.exports = routerPayments;