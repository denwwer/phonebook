const bunyan = require('bunyan');
const Logger = require('express-bunyan-logger');

const log = bunyan.createLogger({
  name: 'app',
  level: 'debug',
  streams: [{
    path: 'log/app.log'
  }]
});

global.log = log;

module.exports = {
  accessLog: Logger({
    name: 'access',
    obfuscate: ['req.body.password'],
    streams: [{
      path: 'log/access.log',
      period: '1d',
      count: 3
    }]
  }),

  errorLog: Logger.errorLogger({
    name: 'error',
    obfuscate: ['req.body.password'],
    streams: [{
      path: 'log/error.log',
      period: '1d',
      count: 3
    }]
  })
};