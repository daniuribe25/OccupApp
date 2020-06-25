((quoteCtrl, quoteRepo, quoteMediaRepo, uploadServices,
  mongoose, notificationService, notificationTokenRepo,
  chatRepo, pushActions, quoteStatus) => {

  quoteCtrl.getAll = (req, res) => {
    quoteRepo.get({}, 0, (response) => {
      res.json(response);
    });
  }

  quoteCtrl.getById = async (req, res) => {
    const response = await quoteRepo.getPopulated({ _id: mongoose.Types.ObjectId(req.params.id) }, 1);
    if (response.output.length) response.output = response.output[0];
    res.json(response);
  }

  quoteCtrl.getByUser = async (req, res) => {
    const { user } = req.params;
    const query = { "$or" : [
      { sentById: user },
      { receivedById: user }
    ]};
    const response = await quoteRepo.getPopulated(query, 0);
    res.json(response);
  }

  quoteCtrl.getWithServiceByUser = async (req, res) => {
    const { user } = req.params;
    const query = { "$or" : [
      { sentById: user },
      { receivedById: user }
    ]};
    const response = await quoteRepo.getWithService(query, 0);
    res.json(response);
  }

  quoteCtrl.sendQuoteNotification = async (userId, title, message, action, id) => {
    const response = await notificationTokenRepo.get({ userId }, 1);
    if (response.success) {
      var data = {
        app_id: "368c949f-f2ef-4905-8c78-4040697f38cf",
        contents: { en: message },
        headings: { en: title },
        template_id: '1bc00fbd-1b9a-4f5f-abdd-83f48a0418cf',
        include_player_ids: [response.output[0].token],
        data: { action, id }
      };
  
      notificationService.send(data, () => {}, (e) => {
        console.log(JSON.parse(e))
      });
    }
  }

  quoteCtrl.create = async (req, res) => {
    const { files, body } = req;
    const quoteResponse = await quoteRepo.create(body);
    if (quoteResponse.success) {
      this.sendQuoteNotification(body.receivedBy,
        "Tienes una nueva Cotización",
        "Respondela tan pronto sea posible",
        pushActions.SENT,
        quoteResponse.output._id);
    }
    if (files && quoteResponse.success) {
      const mediaArr = [];
      newQuote = quoteResponse.output._doc;
      for (let i = 0; i < files.length; i += 1) {
        const result = await uploadServices.uploadImage(files[i], 'Quote');
        if (result.success) {
          mediaArr.push({
            quote: newQuote._id.toString(),
            mediaUrl: result.output.secure_url,
            type: 'img',
          });
        }
        if (result && mediaArr.length === files.length) {
          const mediaResponse = await quoteMediaRepo.create(mediaArr);
          await quoteRepo.update(newQuote._id, { quoteMedia: mediaResponse.output.map(x => x._id) });
          res.json(quoteResponse);
        }
      }
    } else res.json(quoteResponse);
  }

  quoteCtrl.answerQuote = async (req, res) => {
    const { body } = req;
    const quotes = { status: body.status }
    if (body.price) quotes.price = +body.price;
    if (body.observation) quotes.observation = body.observation;
    const updateResp = await quoteRepo.update(body.id, quotes);
    if (updateResp.success) {
      let title, message, userId = '';
      if (quotes.status === quoteStatus.ANSWERED || quotes.status === quoteStatus.REJECTED) {
        title = 'Cotización respondida';
        message = 'Rápido! Revisa lo que te han respondido';
        userId = body.sentBy;
      } else {
        title = 'Precio de cotización revisado';
        message = 'El solicitante ha dado una respuesta a tu precio, vamos a verla!';
        userId = body.receivedBy;
      }
      this.sendQuoteNotification(userId, title, message, quotes.status, body.id);

      if (quotes.status === quoteStatus.ACCEPTED) {
        const chat = { user1: body.sentBy, user2: body.receivedBy };
        await chatRepo.findOrCreate(chat);
      }
      res.json(updateResp);
    } else res.json(updateResp);
  }

  quoteCtrl.update = async (req, res) => {
    const quotes = {
      description: req.body.description,
      user: req.body.user,
      quote: req.body.quote,
      quoteMedia: [],
      isActive: req.body.isActive,
    };
    const updateServResponse = await quoteRepo.update(req.params.id, quotes);
    if (updateServResponse.success) {
      const deleteMediaResponse = await quoteMediaRepo.delete({ quote: mongoose.Types.ObjectId(req.params.id) })
      if (deleteMediaResponse.success) {
        const idQuote = req.params.id;
        const mediaArr = req.body.quoteMedia.map((x) => {
          x.quote = idQuote;
          return x;
        });
        const mediaResponse = await quoteMediaRepo.create(mediaArr);
        if (mediaResponse.success) {
          const query = { $push: { quoteMedia: mediaResponse.output.map(m => m.id) }};
          const finalResp = await quoteRepo.update(req.params.id, query);
          res.json(finalResp);
        } else res.json(updateServResponse);
      } else res.json(updateServResponse);
    } else res.json(updateServResponse);
  }

  quoteCtrl.rateService = async (req, res) => {
    const quote = { rating: req.body.rating };
    const updateQuoteResponse = await quoteRepo.update(req.body.quoteId, quote);
    res.json(updateQuoteResponse);
  }

  quoteCtrl.delete = async (req, res) => {
    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const response = await quoteRepo.delete(query);
    if (response.success) {
      await quoteMediaRepo.delete({ quote: mongoose.Types.ObjectId(req.params.id) });
      res.json(response);
    } else res.json(response);
  }

 })(
  module.exports,
  require('../../repository/quote/quoteRepo'),
  require('../../repository/quote/quoteMediaRepo'),
  require('../../helpers/uploadServices'),
  require('mongoose'),
  require('../../helpers/notificationService'),
  require('../../repository/common/notificationTokenRepo'),
  require('../../repository/chat/chatRepo'),
  require('../../config/constants').pushActions,
  require('../../config/constants').quoteStatus
)