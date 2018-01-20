require('dotenv').config();

const auth = require('./app/services/auth');
const User = require('./app/resources/user');
const Session = require('./app/resources/session');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  require('./config/database').connect();

  // CORS
  const cors = require('cors');
  const corsConf = {
    origin: '*'
  };

  app.use(cors(corsConf));
}

const authConf = {
  except: [{'GET': '/'}, {'POST': '/user'}, {'POST': '/user/sessions'}]
};

global.Promise = require('bluebird');

// Middleware
app.use(auth(authConf));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  // Log requests
  const logger = require('morgan');
  const fs = require('fs');
  const logPath = path.join(__dirname, 'log');
  const logStream = fs.createWriteStream(path.join(logPath, 'access.log'), {flags: 'a'});

  app.use(logger('short', {stream: logStream}));
}

app.listen(port, () => console.log(`App starting on port ${port}`));

// Routes
app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.post('/user', User.create);
app.post('/user/sessions', Session.create);

// node app.js >log-file.txt 2>error-file.txt

module.exports = app;
