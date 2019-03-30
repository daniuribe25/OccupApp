'use strict';
((express, http, bodyParser, methodOverride, mongoConnection, authenticateUser, cors, fs, path) => {

  // Config and variables
  require('custom-env').env(process.env.NODE_ENV);
  const app = express();
  const server_port = process.env.PORT || 3000;
  http.createServer(app);
  mongoConnection.connect();

  try {
    fs.mkdirSync(path.join(__dirname, '/uploads/'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
  
  // Middlewares
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(authenticateUser);
  app.use(cors);
  app.use(express.static(__dirname + '/public'));

  // Routes to controllers
  const routerUser = require('./routes/usersRoutes');
  app.use('/api', routerUser);

  const routerUserService = require('./routes/userServicesRoutes');
  app.use('/api', routerUserService);

  app.use('/', (req,res) => {
    res.send('Occupap Api');
  });

  // Boot app
  app.listen(server_port, () => {
      console.log("Node server running on port - " + server_port);
  });
})(
  require("express"),
  require("http"),
  require("body-parser"),
  require("method-override"),
  require('./mongoConnection'),
  require('./config/middlewares').authenticateUser,
  require('./config/middlewares').cors,
  require('fs'),
  require('path'),
)