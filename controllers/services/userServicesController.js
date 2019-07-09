((userServicesCtrl, userServicesRepo, serviceMediaRepo, mongoose, quoteRepo) => {

  userServicesCtrl.getAll = (req, res) => {
    userServicesRepo.getPopulated({ isActive: { $not: false }}, 0, (response) => {
        res.json(response);
    });
  }

  userServicesCtrl.getById = (req, res) => {
    const { id } = req.params;
    userServicesRepo.getPopulated({ _id: mongoose.Types.ObjectId(id) }, 1, (response) => {
      if (response.output.length) response.output = response.output[0];
      res.json(response);
    });
  }

  userServicesCtrl.getByUser = (req, res) => {
    const { userId } = req.params;
    userServicesRepo.getPopulated({ userId }, 0, (response) => {
      if (response.success && response.output.length) {
        const ids = response.output.map(x => x.serviceId.toString());
        const query = { $and: [{ serviceId: { $in: ids } }, { receivedById: userId}] };
        quoteRepo.get(query, 0, (resp) => {
          const userServices = response.output.map(us => {
            const quotes = resp.output.filter(x => x.serviceId === us.serviceId && x.rating)
            let total = 0;
            for (let i = 0; i < quotes.length; i += 1) {
              total +=  +quotes[i].rating;
            }
            us.rating = quotes.length ? total / quotes.length : 5;
            return us;
          });
          resp.output = userServices;
          res.json(resp);
        });
      } else res.json(response);
      
    });
  }

  userServicesCtrl.create = (req, res) => {
    const newService = req.body;
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

  userServicesCtrl.disableService = (req, res) => {
    const service = {
      isActive: req.body.isActive,
    };
    userServicesRepo.update(req.params.id, service, (updateServResponse) => {
      res.json(updateServResponse);
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
  require('../../repository/quote/quoteRepo'),
)