const express  = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
  destination: (req, file, cb) => { cb(null, './uploads/'); },
  filename: (req, file, cb) => {
    const fileName = (new Date().toISOString()).replace(/:/g, '-');
    cb(null, `${fileName}_${file.originalname}`)}
}) });

const usersCtrl = require('../controllers/users/usersController');
const routerUser = express.Router();

routerUser.route('/users')
    .get(usersCtrl.getAll)
    .patch(upload.single('profileImage'), usersCtrl.update)
    .post(upload.single('profileImage'), usersCtrl.create);

routerUser.route('/users/:id')
    .get(usersCtrl.getById)
    .delete(usersCtrl.delete);

routerUser.route('/usersByEmail/:email').get(usersCtrl.getByEmail)
routerUser.route('/updatePass').post(usersCtrl.updatePass)
routerUser.route('/authUser').post(usersCtrl.authUser)
routerUser.route('/recoverPassword/:email').get(usersCtrl.recoverPassword)
routerUser.route('/linkDaviplata/').post(usersCtrl.linkDaviplata)
    

module.exports = routerUser;