((vehiclesCtrl,
  vehicleRepo,
  vehicleQuoteRepo,
  vehicleQuoteMediaRepo,
  notificationTokenRepo,
  notificationService,
  VehicleCategory, VehicleBrand, VehicleReference, VehicleSection, VehicleItem,
  uploadServices,
  appRoles,
  pushActions) => {

  vehiclesCtrl.getList = async (req, res, model) => {
    const ans = getQuery(req, model)
    const response = await vehicleRepo.get(ans.query, ans.model);
    res.json(response);
  }

  getQuery = (req, model) => {
    switch (model) {
      case 'category':
        return { query: { isActive: { $ne: false }},
          model: VehicleCategory };
      case 'brand':
        return { query: { $and: [{ vehicleCategoryId: req.params.categoryId }, { isActive: { $ne: false }} ]},
          model: VehicleBrand };
      case 'reference':
        return { query: { $and: [{ vehicleBrandId: req.params.brandId }, { isActive: { $ne: false }} ]},
          model: VehicleReference };
      case 'section':
        return { query: { $and: [{ vehicleCategoryId: req.params.categoryId }, { isActive: { $ne: false }} ]},
          model: VehicleSection };
      case 'item':
        return { query: { $and: [{ vehicleSectionId: req.params.sectionId }, { isActive: { $ne: false }} ]},
          model: VehicleItem };
    };
  }

  vehiclesCtrl.create = async (req, res) => {
    const { files, body } = req;
    const quoteResponse = await vehicleQuoteRepo.create(body);  
    if (quoteResponse.success) {
      sendQuoteNotification("Tienes una nueva solicitud de compra", "Responde la cotización tan pronto sea posible", pushActions.QUOTE, quoteResponse.output._id);
    }
    if (files && files.length && quoteResponse.success) {
      const mediaArr = [];
      newQuote = quoteResponse.output._doc;
      for (let i = 0; i < files.length; i += 1) {
        const result = await uploadServices.uploadImage(files[i], 'VehicleQuote');
        if (result.success) {
          mediaArr.push({
            quote: newQuote._id.toString(),
            mediaUrl: result.output.secure_url,
            type: 'img',
          });
        }
        if (result && mediaArr.length === files.length) {
          const mediaResponse = await vehicleQuoteMediaRepo.create(mediaArr);
          await vehicleQuoteRepo.update(newQuote._id, { quoteMedia: mediaResponse.output.map(x => x._id) });
          res.json(quoteResponse);
        }
      }
    } else res.json(quoteResponse);
  }

  sendQuoteNotification = async (title, message, action, id) => {
    const notResponse = await notificationTokenRepo.get({ role: appRoles.SELLER }, 0);
    if (notResponse.success && notResponse.output.length) {
      var data = {
        app_id: "368c949f-f2ef-4905-8c78-4040697f38cf",
        contents: { en: message },
        headings: { en: title },
        template_id: '1bc00fbd-1b9a-4f5f-abdd-83f48a0418cf',
        include_player_ids: notResponse.output.map(x => x.token),
        data: { action, id }
      };
  
      notificationService.send(data, () => {}, (e) => {
        console.log(JSON.parse(e))
      });
    }
  }

})(
  module.exports,
  require('../../repository/vehicle/vehicleRepo'),
  require('../../repository/vehicleQuote/vehicleQuoteRepo'),
  require('../../repository/vehicleQuote/vehicleQuoteMediaRepo'),
  require('../../repository/common/notificationTokenRepo'),
  require('../../helpers/notificationService'),
  require('../../models/vehicle/VehicleCategory'),
  require('../../models/vehicle/VehicleBrand'),
  require('../../models/vehicle/VehicleReference'),
  require('../../models/vehicle/VehicleSection'),
  require('../../models/vehicle/VehicleItem'),
  require('../../helpers/uploadServices'),
  require('../../config/constants').appRoles,
  require('../../config/constants').pushActions
);
