const jwt = require('jsonwebtoken');

const middlewares = {
  authenticateUser: (req, res, next) => {
    // if ((req.path !== '/api/user' || req.method !== 'POST') &&
    //   (req.path !== '/api/authUser' || req.method !== 'GET')) {

    //   if (req.headers['x-access-token']) {
    //     jwt.verify(req.headers['x-access-token'], "secret_secret", (err, decoded) => {
    //       if (decoded) {
    //         const id = req.headers['occuper-id']
    //         if (decoded.id !== id) {
    //           res.status(401).send("Unauthorized");
    //         }
    //       } else {
    //         res.status(401).send("Unauthorized");
    //       }
    //     });
    //   } else {
    //     res.status(401).send("No access token provided");
    //   }
    // }
      
    next();
  },
  
  cors: (req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }
}

module.exports = middlewares;