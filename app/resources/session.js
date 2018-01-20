const Session = require('../models/session');

module.exports = {
  create: function (req, res) {
    const session = new Session({ username: req.body.username,  password: req.body.password });

    session.create().then(token => {
      res.json({token: token});
    }).catch(err => {
      res.status(400).json({errors: err.message});
    });
  }
};