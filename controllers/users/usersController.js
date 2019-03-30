((userController, userRepo, mongoose, commonServ, bcrypt, jwt, uploadServices) => {

  userController.getAll = (req, res) => {
    userRepo.get({}, 0, (response) => {
      res.json(response);
    });
  }

  userController.getById = (req, res) => {
    const { id } = req.params;
    userRepo.get({ _id: mongoose.Types.ObjectId(id) }, 1, (response) => {
      res.json(response);
    });
  }

  userController.getByEmail = (req, res) => {
    const query = { email: req.params.email };
    userRepo.get(query, 1, (response) => {
      res.json(response);
    });
  }

  userController.authUser = (req, res) => {
    const query = { email: req.body.email, password: req.body.password };
    userRepo.get(query, 1, (response) => {
      if (response.output.length) {
        // create a token
        var token = jwt.sign({ id: response.output[0].id }, "secret_secret", {
          expiresIn: 86400
        });
        response.token = token;
      }
      res.json(response);
    });
  }

  userController.create = (req, res) => {
    const  file = req.file;
    let newUser = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      name: req.body.name,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      docType: req.body.docType,
      document: req.body.document,
      cel: req.body.cel
    };
    // create user
    userRepo.create(newUser, (response) => {
      if (response.success) {
        // upload and set image url
        newUser = response.output._doc;
        newUser.profileImage = file;
        uploadServices.uploadProfileImage(newUser, (err, result) => {
          if (response.success) {
            newUser.profileImage = result.url;
            userRepo.update(newUser._id, newUser, (response) => {
              if (!response.success) console.log(response.message);
            });
          }
        });
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

  const sendUserEmail = (name, to) => {
    const htmlContent = "<div style='width:100px;height:100px;background:rgb(29, 172, 255)'>Buenos días " + name +" </div>";

    commonServ.sendEmail(
      'Occupapp wellcome',
      'dani.uribe25@gmail.com', to,
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