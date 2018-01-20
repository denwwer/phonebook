const User = require('../models/user');
const argon2 = require('argon2');

class Session {
  constructor({username, password}) {
    this.username = username;
    this.password = password;
  }

  create() {
    const _this = this;
    const incorrect = new Error('Incorrect username or password');

    return new Promise((resolve, reject) => {
      User.findOne({username: this.username}).exec((err, user) => {
        if (err) {
          console.error(err);
          reject(incorrect);
        }

        if (!user) {
          reject(incorrect);
        }

        argon2.verify(user.password, _this.password).then(match => {
          if (match) {
            resolve(user.token);
          } else {
            reject(incorrect);
          }
        });
      });
    });
  }
}

module.exports = Session;