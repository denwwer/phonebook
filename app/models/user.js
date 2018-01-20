const crypto = require('crypto');
const argon2 = require('argon2');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

schema.pre('validate', function(next) {
  return this.constructor.count({ username: this.username }, function (err, count) {
    if (err) { return next(err); }

    if (count === 1) {
      let err = new Error('`username` is not uniq');
      next(err);
    }
  });
});

schema.pre('validate', function(next) {
  let _this = this;
  return Promise.all([gToken(), gPassword(_this.password)]).then(arg => {
    _this.token = arg[0];
    _this.password = arg[1];
    next();
  });
});

function gToken() {
  return crypto.randomBytes(32).toString('hex');
}

function gPassword(password) {
  if (!password) { return null; }

  return argon2.hash(password).then(hash => {
    return hash;
  }).catch(err => {
    console.error(err);
    return null;
  });
}

module.exports = mongoose.model('User', schema);