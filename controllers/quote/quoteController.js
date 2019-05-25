((quoteCtrl, quoteRepo, quoteMediaRepo, uploadServices, mongoose) => {

  quoteCtrl.getAll = (req, res) => {
    quoteRepo.get({}, 0, (response) => {
        res.json(response);
    });
  }

  quoteCtrl.getById = (req, res) => {
    const { id } = req.params;
    quoteRepo.get({ _id: mongoose.Types.ObjectId(id) }, 1, (response) => {
      if (response.output.length) response.output = response.output[0];
      res.json(response);
    });
  }

  quoteCtrl.create = (req, res) => {
    const { files, body } = req;
    quoteRepo.create(body, (quoteResponse) => {
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
)