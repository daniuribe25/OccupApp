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
    .post(upload.single('profileImage'), usersCtrl.create);

routerUser.route('/users/:id')
    .get(usersCtrl.getById)
    .patch(usersCtrl.update)
    .delete(usersCtrl.delete);

routerUser.route('/usersByEmail/:email')
    .get(usersCtrl.getByEmail)

routerUser.route('/authUser')
    .post(usersCtrl.authUser)

module.exports = routerUser;