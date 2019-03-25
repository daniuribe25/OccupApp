((express, bodyParser, User) => {
  const router = express.Router();
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

})(
  require('express'),
  require('body-parser'),
  require('../../models/User'),
)