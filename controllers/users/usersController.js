((userController, userRepo, mongoose, commonServ, bcrypt, jwt, uploadServices) => {

  userController.getAll = (req, res) => {
    userRepo.get({}, 0, (response) => {
      res.json(response);
    });
  }

  userController.getById = (req, res) => {
    const { id } = req.params;
    userRepo.get({ _id: mongoose.Types.ObjectId(id) }, 1, (response) => {
      response.output = response.success ? response.output[0]._doc : null;
      res.json(response);
    });
  }

  userController.getByEmail = (req, res) => {
    const query = { email: req.params.email };
    userRepo.get(query, 1, (response) => {
      response.output = response.success ? response.output[0]._doc : null;
      res.json(response);
    });
  }

  userController.authUser = (req, res) => {
    
    const query = { email: req.body.email };
    userRepo.get(query, 1, (response) => {
      if (response.output.length) {
        const pass = req.body.password ? bcrypt.compareSync(req.body.password, response.output[0].password) : null;
        if (pass || req.body.loginType === 'FB') {
          // create a token
          response.token = jwt.sign({ id: response.output[0].id }, "secret_secret", { expiresIn: 86400 });
        } else {
          response.success = false;
          response.message = "Password invalido."
        }
      } else {
        response.success = false;
        response.message = "Usuario no existe"
      }
      response.output = response.success ? response.output[0]._doc : {};
      res.json(response);
    });
  }

  userController.create = (req, res) => {
    const  file = req.file;
    let newUser = {
      email: req.body.email,
      password: req.body.password ?
        bcrypt.hashSync(req.body.password, 12) : 'occ',
      name: req.body.name,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      cel: req.body.cel,
      loginType: req.body.loginType,
      profileImage: !req.file ? req.body.profileImage : '',
    };
    // create user
    userRepo.create(newUser, (response) => {
      if (response.success) {
        if (req.file) {
          // upload and set image url
          newUser = response.output._doc;
          uploadServices.uploadImage(file, 'ProfileImages', (err, result) => {
            if (response.success) {
              newUser.profileImage = result.url;
              userRepo.update(newUser._id, newUser, (response) => {
                if (!response.success) console.log(response.message);
              });
            }
          });
        }
        //send email
        sendUserEmail(response.output.name, response.output.email);
        // create a token
        var token = jwt.sign({ id: response.output.id }, "secret_secret", {
          expiresIn: 86400
        });
        response.token = token;
      }
      res.json(response);
    });
  }

  userController.loginFacebook = (req, res) => {
    let newUser = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      name: req.body.name,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      cel: req.body.cel,
      loginType: req.body.loginType,
    };
    // create login user
    userRepo.upsert(newUser, (response) => {
      res.json(response);
    });
  }

  userController.update = (req, res) => {
    let user = {
      email: req.body.email,
      pass: req.body.pass,
      name: req.body.name,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      docType: req.body.docType,
      document: req.body.document,
      cel: req.body.cel
    };
    userRepo.update(req.params.id, user, (response) => {
      res.json(response);
    });
  }

  userController.delete = (req, res) => {
    userRepo.delete(req.params.id, (response) => {
      res.json(response);
    });
  }

  userController.recoverPassword = (req, res) => {
    const query = { email: req.params.email };
    userRepo.get(query, 1, (response) => {
      // check if user with email was found
      if (response.success) {
        const user = response.output[0];
        // if type is not facebook then lets create a new password and sent it to the user by email
        if (user.loginType === 'LO') { 
          let newPass = '';
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < 6; i++) {
            newPass += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          user.password = bcrypt.hashSync(newPass, 12);
          // update user with new password
          userRepo.update(user.id, user, (updateResp) => {
            // send email with new pass
            if (updateResp.success) {
              sendUserPasswordRecover(user.name, user.email, newPass);
            }
            res.json(updateResp);
          });
        } else {
          response.message = "Email se encuentra registrado a una cuenta de Facebook, por favor intenta ingresando por la opción de 'Continuar con facebook'"
          res.json(response);
        }
      } else {
        response.message = "Usuario no encontrado, asegurate de ingresar el email correctamente."
        res.json(response);
      }
    });
  }

  const sendUserEmail = (name, to) => {
    const htmlContent = "<div style='width:100px;height:100px;background:rgb(29, 172, 255)'>Buenos días " + name +" </div>";

    commonServ.sendEmail(
      'Occupapp wellcome',
      'dani.uribe25@gmail.com', to,
      htmlContent, '',
      (result) => result
    );
  };

  const sendUserPasswordRecover = (name, to, password) => {
    const htmlContent = `Nuevo password: ${password} <br /><br />
                        Por favor asegurate de cambiar el password cuando ingreses a la aplicación`;

    commonServ.sendEmail(
      'Nuevo password Occupapp',
      'dani.uribe25@gmail.com', 'dani.uribe25@gmail.com',
      htmlContent, '',
      (result) => result
    );
  };

})(
  module.exports,
  require('../../repository/usersRepo'),
  require('mongoose'),
  require('../../helpers/commonServices'),
  require('bcryptjs'),
  require('jsonwebtoken'),
  require('../../helpers/uploadServices'),
)