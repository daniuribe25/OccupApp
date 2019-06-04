((quoteCtrl, quoteRepo, quoteMediaRepo, uploadServices, mongoose, notificationService, notificationTokenRepo) => {

  quoteCtrl.getAll = (req, res) => {
    quoteRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  quoteCtrl.getById = (req, res) => {
    quoteRepo.getPopulated({ _id: mongoose.Types.ObjectId(req.params.id) }, 1, (response) => {
      if (response.output.length) response.output = response.output[0];
      res.json(response);
    });
  }

  quoteCtrl.getByUser = (req, res) => {
    const { user } = req.params;
    const query = { "$or" : [
      { sentBy: mongoose.Types.ObjectId(user) },
      { receivedBy: mongoose.Types.ObjectId(user) }
    ]};
    quoteRepo.getPopulated(query, 0, (response) => {
      res.json(response);
    });
  }

  quoteCtrl.getWithServiceByUser = (req, res) => {
    const { user } = req.params;
    const query = { "$or" : [
      { sentBy: mongoose.Types.ObjectId(user) },
      { receivedBy: mongoose.Types.ObjectId(user) }
    ]};
    quoteRepo.getWithService(query, 0, (response) => {
      res.json(response);
    });
  }

  quoteCtrl.sendQuoteNotification = (receivedBy) => {
    notificationTokenRepo.get({ userId: receivedBy }, 1, (response) => {
      if (response.success) {
        var data = {
          app_id: "368c949f-f2ef-4905-8c78-4040697f38cf",
          contents: { en: "Respondela tan pronto sea posible"},
          headings: { en: "Nueva Cotización"},
          template_id: '1bc00fbd-1b9a-4f5f-abdd-83f48a0418cf',
          include_player_ids: response.output[0].token,
        };
    
        notificationService.send(data, () => {}, (e) => {
          console.log(JSON.parse(e))
        });
      }
    });
  }

  quoteCtrl.create = (req, res) => {
    const { files, body } = req;
    quoteRepo.create(body, (quoteResponse) => {
      if (quoteResponse.success) {
        this.sendQuoteNotification(body.receivedBy);
      }
      if (files && quoteResponse.success) {
        const mediaArr = [];
        newQuote = quoteResponse.output._doc;
        for (let i = 0; i < files.length; i += 1) {
          uploadServices.uploadImage(files[i], 'Quote', (err, result) => {
            if (result) {
              mediaArr.push({
                quote: newQuote._id,
                mediaUrl: result.url,
                type: 'img',
              });
            }
            if (result && mediaArr.length === files.length) {
              quoteMediaRepo.create(mediaArr, (mediaResponse) => {
                quoteRepo.update(newQuote._id, { quoteMedia: mediaResponse.output.map(x => x._id) },(finalResp) => {});
              });
            }
          });
        }
      }
      res.json(quoteResponse);
    });
  }

  quoteCtrl.answerQuote = (req, res) => {
    const quotes = { state: req.body.state ? 'Answered' : 'Rejected' }
    if (req.body.price) quotes.price = +req.body.price;
    if (req.body.observation) quotes.observation = req.body.observation;
    quoteRepo.update(req.body.id, quotes, (updateResp) => {
      res.json(updateResp);
    });
  }

  quoteCtrl.update = (req, res) => {
    const quotes = {
      description: req.body.description,
      user: req.body.user,
      quote: req.body.quote,
      quoteMedia: [],
      isActive: req.body.isActive,
    };
    quoteRepo.update(req.params.id, quotes, (updateServResponse) => {
      if (updateServResponse.success) {
        quoteMediaRepo.delete({ quote: mongoose.Types.ObjectId(req.params.id) },
        (deleteMediaResponse) => {
          if (deleteMediaResponse.success) {
            const idQuote = req.params.id;
            const mediaArr = req.body.quoteMedia.map((x) => {
              x.quote = idQuote;
              return x;
            });
            quoteMediaRepo.create(mediaArr, (mediaResponse) => {
              if (mediaResponse.success) {
                quoteRepo.update(req.params.id,
                  { $push: { quoteMedia: mediaResponse.output.map(m => m.id) }},
                  (finalResp) => {
                    if (finalResp.success) {
                      res.json(finalResp);
                    }
                });
              }
            });
          }
        });
      } else res.json(quoteResponse);
    });
  }

  quoteCtrl.delete = (req, res) => {
    let query = { _id: mongoose.Types.ObjectId(req.params.id) };
    quoteRepo.delete(query, (response) => {
      if (response.success) {
        quoteMediaRepo.delete({ quote: mongoose.Types.ObjectId(req.params.id) },
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
  require('../../repository/quote/quoteRepo'),
  require('../../repository/quote/quoteMediaRepo'),
  require('../../helpers/uploadServices'),
  require('mongoose'),
  require('../../helpers/notificationService'),
  require('../../repository/common/notificationTokenRepo'),
)