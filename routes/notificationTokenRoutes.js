const express  = require("express");

const nTCtrl = require('../controllers/common/notificationTokenController');
const routerNotificationToken = express.Router();

routerNotificationToken.route('/notificationToken')
    .get(nTCtrl.getAll)
    .post(nTCtrl.create);

module.exports = routerNotificationToken;