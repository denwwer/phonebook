const url = require('url');
const User = require('../models/user');

/**
 * Authentication
 * @param {array} except - skip authorisation for routers, example ['GET': '/', 'POST': '/new']
 */
module.exports = function ({except}) {
  return function (req, res, next) {
    if (skip(except, req)) {
      next();
    } else {
      authorized(req)
        .then(user => {
          req.User = user;
          next();
        }).catch(() => {
          res.status(401).json({});
        });
    }
  };
};

/**
 * Check if skip auth for method and path
 * @param {array} except
 * @param {object} req
 * @returns {bool}
 */
function skip(except, req) {
  if (!except) { return false; }

  let skipped = false;
  const path = url.parse(req.url).pathname;

  for (let i = 0; i < except.length; i++) {
    let r = except[i];
    if (r[req.method] === path) {
      skipped = true;
      break;
    }
  }

  return skipped;
}

/**
 * Check if user auth
 * @param {object} req
 * @returns {object} - User Object
 */
function authorized(req) {
  const token = req.headers.token;
  const unAuth = new Error('Unauthorized');

  return new Promise((reselve, reject) => {
    if (!token) { return reject(unAuth); }

    User.findOne({ token: token }).select('-password').exec((err, user) => {
      if (err || !user) { return reject(unAuth); }
      reselve(user.toObject());
    });
  });
}