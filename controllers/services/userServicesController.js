((userServicesCtrl, userServicesRepo, serviceMediaRepo, uploadServices, mongoose, quoteRepo) => {

  userServicesCtrl.getAll = async (req, res) => {
    const response = await userServicesRepo.getPopulated({ isActive: { $ne: false }}, 0)
    res.json(response);
  }

  userServicesCtrl.getById = async (req, res) => {
    const { id } = req.params;
    const response = await userServicesRepo.getPopulated({ _id: mongoose.Types.ObjectId(id) }, 1)
    if (response.output.length) response.output = response.output[0];
    res.json(response);
  }

  userServicesCtrl.getByUser = async (req, res) => {
    const { userId } = req.params;
    const response = await userServicesRepo.getPopulated({ userId }, 0);
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
  }

  userServicesCtrl.create = async (req, res) => {
    const { files, body } = req;
    let newService = body;
    const userServices = await userServicesRepo.get({ userId: newService.user  });
    const exist = userServices.output.some(x => x.service.toString() === newService.service);
    if (!exist) {
      const servResponse = await userServicesRepo.create(newService);

      if (files && servResponse.success) {
        const mediaArr = [];
        newService = servResponse.output._doc;
        for (let i = 0; i < files.length; i += 1) {
          const result = await uploadServices.uploadImage(files[i], 'UserServices');
          if (result.success) {
            mediaArr.push({
              userService: newService._id,
              mediaUrl: result.output.url,
              publicId: result.output.public_id,
              type: 'img',
            });
          }

          if (result && mediaArr.length === files.length) {
            const mediaResponse = await serviceMediaRepo.create(mediaArr);
  
            await userServicesRepo.update(newService._id.toString(),
              { serviceMedia: mediaResponse.output.map(x => x._id) });
  
            newService.serviceMedia = mediaArr;
            servResponse.output = newService;
            res.json(servResponse);
          }
        }
      } else res.json(servResponse);
    } else {
      userServices.success = false;
      userServices.message = 'Ya tienes un servicio de este tipo registrado';
      res.json(userServices)
    }
  }

  userServicesCtrl.disableService = (req, res) => {
    const service = {
      isActive: req.body.isActive,
    };
    userServicesRepo.update(req.params.id, service, (updateServResponse) => {
      res.json(updateServResponse);
    });
  }

  userServicesCtrl.update = async (req, res) => {
    const service = {
      description: req.body.description,
      service: req.body.service,
    };
    const updateServResponse = await userServicesRepo.update(req.body._id, service);
    if (updateServResponse.success) {
      if (req.body.mediaToRemove) {
        let { mediaToRemove } = req.body;
        mediaToRemove = JSON.parse(mediaToRemove);
        if (mediaToRemove.length) {
          mediaToRemove.forEach(async e => {
            await uploadServices.deleteImage(e);
          });
          await serviceMediaRepo.delete({ publicId: { $in: mediaToRemove } });
        };
      }

      if (req.files.length) {
        const mediaArr = [];
        for (let i = 0; i < req.files.length; i += 1) {
          const result = await uploadServices.uploadImage(req.files[i], 'UserServices');
          if (result.success) {
            mediaArr.push({
              userService: req.body._id,
              mediaUrl: result.output.url,
              publicId: result.output.public_id,
              type: 'img',
            });
          }

          if (result && mediaArr.length === req.files.length) {
            const mediaResponse = await serviceMediaRepo.create(mediaArr);
  
            await userServicesRepo.update(req.body._id,
              { $push: { serviceMedia: { $each: mediaResponse.output.map(x => x._id) } } });
  
            res.json(updateServResponse);
          }
        }
      } else res.json(updateServResponse);
    } else res.json(servResponse);
  }

  userServicesCtrl.delete = async (req, res) => {
    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    userServicesRepo.delete(query, async (response) => {
      if (response.success) {
        await serviceMediaRepo.delete({ service: mongoose.Types.ObjectId(req.params.id) });
        res.json(response);
      } else res.json(response);
    });
  }

 })(
  module.exports,
  require('../../repository/service/userServicesRepo'),
  require('../../repository/service/serviceMediaRepo'),
  require('../../helpers/uploadServices'),
  require('mongoose'),
  require('../../repository/quote/quoteRepo'),
)