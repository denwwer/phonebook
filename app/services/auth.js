const url = require('url');
const User = require('../models/user');

/**
 * Authentication
 * @param {array} except - skip authorisation for routers, example ['GET': '/', 'POST': '/new']
 */
module.exports = function ({except}) {
  return function (req, res, next) {
    if ((skip(except, req)) || authorized(req)) {
      next();
    } else {
      res.sendStatus(401);
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
 * @returns {bool}
 */
function authorized(req) {
  const token = req.headers['Token'];

  if (!token) { return false; }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  User.find({ _id: decoded.id }, function (err, user) {
    if (err) { return false; }
    req.User = user;
  });
}