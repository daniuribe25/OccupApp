var express  = require("express");

var usersCtrl = require('../controllers/users/usersController');
var routerUser = express.Router();

routerUser.route('/users')
    .get(usersCtrl.getAll)
    .post(usersCtrl.create);

routerUser.route('/users/:id')
    .get(usersCtrl.getById)
    .patch(usersCtrl.update)
    .delete(usersCtrl.delete);

routerUser.route('/usersByEmail/:email')
    .get(usersCtrl.getByEmail)

routerUser.route('/authUser')
    .post(usersCtrl.authUser)

module.exports = routerUser;