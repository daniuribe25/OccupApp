((userServicesCtrl, userServicesRepo, serviceMediaRepo, mongoose) => {

  userServicesCtrl.getAll = (req, res) => {
    userServicesRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  userServicesCtrl.getById = (req, res) => {
    const { id } = req.params;
    userServicesRepo.get({ _id: mongoose.Types.ObjectId(id) }, 1, (response) => {
      if (response.output.length) response.output = response.output[0];
      res.json(response);
    });
  }

  userServicesCtrl.create = (req, res) => {
    const newService = {
      description: req.body.description,
      user: req.body.user,
      service: req.body.service,
      isActive: true,
    };

    userServicesRepo.create(newService, (servResponse) => {
      if (req.body.serviceMedia) {
        const idService = servResponse.output.id;
        const mediaArr = req.body.serviceMedia.map((x) => {
          x.service = idService;
          return x;
        });
        serviceMediaRepo.create(mediaArr, (mediaResponse) => {
          userServicesRepo.update(servResponse.output.id,
            { $push: { serviceMedia: mediaResponse.output.map(m => m.id) }},
            (finalResp) => {
              res.json(finalResp);
          });
        });
      } else res.json(servResponse);
    });
  }

  userServicesCtrl.update = (req, res) => {
    const services = {
      description: req.body.description,
      user: req.body.user,
      service: req.body.service,
      serviceMedia: [],
      isActive: req.body.isActive,
    };
    userServicesRepo.update(req.params.id, services, (updateServResponse) => {
      if (updateServResponse.success) {
        serviceMediaRepo.delete({ service: mongoose.Types.ObjectId(req.params.id) },
        (deleteMediaResponse) => {
          if (deleteMediaResponse.success) {
            const idService = req.params.id;
            const mediaArr = req.body.serviceMedia.map((x) => {
              x.service = idService;
              return x;
            });
            serviceMediaRepo.create(mediaArr, (mediaResponse) => {
              if (mediaResponse.success) {
                userServicesRepo.update(req.params.id,
                  { $push: { serviceMedia: mediaResponse.output.map(m => m.id) }},
                  (finalResp) => {
                    if (finalResp.success) {
                      res.json(finalResp);
                    }
                });
              }
            });
          }
        });
      } else res.json(servResponse);
    });
  }

  userServicesCtrl.delete = (req, res) => {
    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    userServicesRepo.delete(query, (response) => {
      if (response.success) {
        serviceMediaRepo.delete({ service: mongoose.Types.ObjectId(req.params.id) },
          (deleteMediaResponse) => {
            if (deleteMediaResponse.success) {
              res.json(response);
            }
        });
      }
    });
  }

 })(
  module.exports,
  require('../../repository/service/userServicesRepo'),
  require('../../repository/service/serviceMediaRepo'),
  require('mongoose'),
)