'use strict';
((express, http, bodyParser, methodOverride, mongoConnection,
  authenticateUser, cors, fs, path, socket, mercadopago) => {

  // Config and variables
  require('custom-env').env(process.env.NODE_ENV);
  const server_port = process.env.PORT || 3000;
  // Set express server
  const app = express();
  const httpApp = http.createServer(app);
  // Set socket server
  const io = socket(httpApp)
  const mobileSockets = {};
  // Connect database
  mongoConnection.connect();

  try {
    fs.mkdirSync(path.join(__dirname, '/uploads/'))
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }

  // Set mercadopago
  mercadopago.configure({
    sandbox: true,
    access_token: process.env.MP_ACCESS_TOKEN,
    // client_id: process.env.MP_CLIENT_ID,
    // client_secret: process.env.MP_CLIENT_SECRET
  });
  
  // Middlewares
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(authenticateUser);
  app.use(cors);
  app.use(express.static(__dirname + '/public'));

  // Routes to controllers
  app.use('/api', require('./routes/usersRoutes'));
  app.use('/api', require('./routes/userServicesRoutes'));
  app.use('/api', require('./routes/quotesRoutes'));
  app.use('/api', require('./routes/paymentsRoutes'));
  app.use('/api', require('./routes/notificationTokenRoutes'));
  app.use('/api', require('./routes/serviceCategoriesRoutes'));
  app.use('/api', require('./routes/chatsRoutes'));
  app.use('/api/setPaymentPreferences', (req, res) => {
    require('./controllers/wallet/paymentController').setPaymentPreferences(req, res, mercadopago) });
  app.use('/api/paymentNotification', (req, res) => {
    require('./controllers/wallet/paymentController').paymentNotification(req, res, mercadopago) });
  app.use('/', (req, res) => { res.send('Occupapp Api'); });

  // On socket connection
  const chatSocket = require('./sockets/chatSocket');

  io.on('connection', (socket) => {
    console.log('connection: ', socket.id);
    socket.on('setId', userId => {
      console.log('set user socket: ', userId);
      mobileSockets[userId] = socket.id;
    });
    socket.on('message', message => chatSocket.saveMessage(socket, mobileSockets, message));
  });

 

  // Boot app
  httpApp.listen(server_port, () => {
      console.log(`Node server running on ${server_port}`);
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
  require('socket.io'),
  require('mercadopago')
)