require('dotenv').config();
const logger = require('./config/logger');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const isProd = (process.env.NODE_ENV === 'production');
const isDev = (process.env.NODE_ENV === 'development');

global.Promise = require('bluebird');

if (process.env.NODE_ENV !== 'test') {
  require('./config/database').connect();

  // CORS
  const cors = require('cors');
  const corsConf = {
    origin: '*'
  };

  app.use(cors(corsConf));
}

const auth = require('./app/services/auth');
const authConf = {
  except: [{'GET': '/'}, {'POST': '/user'}, {'POST': '/user/sessions'}]
};

// Middleware
app.use(auth(authConf));
app.use(bodyParser.json());

app.listen(port, () => console.log(`App starting on port ${port}\nEnvironment ${process.env.NODE_ENV}`));

if (isDev) {
  app.use(function (req, res, next) {
    console.log(`\n${req.method} ${req.url}\nparams: ${JSON.stringify(req.params)}\nbody: ${JSON.stringify(req.body)}`);
    next();
  });
} else if (isProd) {
  app.use(logger.accessLog);
}

// Routes
const routes = require('./config/routes');
app.use(routes);

if (isProd) {
  app.use(logger.errorLog);
}

app.use(function (err, req, res) {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json({error: 'Server error'});
});

module.exports = app;
