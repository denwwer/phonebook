const crypto = require('crypto');
const argon2 = require('argon2');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    index: true,
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

schema.plugin(uniqueValidator);

schema.pre('validate', function(next) {
  let _this = this;
  return Promise.all([gToken(), gPassword(_this.password)]).then(arg => {
    _this.token = arg[0];
    _this.password = arg[1];
    next();
  });
});

/**
 * Generate token
 * @requires {string}
 */
function gToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate password hash
 * @param password
 * @returns {string} - null if errors
 */
function gPassword(password) {
  if (!password) { return null; }

  return argon2.hash(password).then(hash => {
    return hash;
  }).catch(err => {
    log.error(err);
    return null;
  });
}

module.exports = mongoose.model('User', schema);