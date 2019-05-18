((quoteCtrl, quoteRepo, quoteMediaRepo, mongoose) => {

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
    const newQuote = req.body;
    quoteRepo.create(newQuote, (quoteResponse) => {
      if (req.body.quoteMedia) {
        const idQuote = quoteResponse.output.id;
        const mediaArr = req.body.quoteMedia.map((x) => {
          x.quote = idQuote;
          return x;
        });
        quoteMediaRepo.create(mediaArr, (mediaResponse) => {
          quoteRepo.update(quoteResponse.output.id,
            { $push: { quoteMedia: mediaResponse.output.map(m => m.id) }},
            (finalResp) => {
              res.json(finalResp);
          });
        });
      } else res.json(quoteResponse);
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
  require('mongoose'),
)