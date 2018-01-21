const Session = require('../models/session');

module.exports = {
  /**
   * Authorize User
   * @param req
   * @param res
   * @returns {object} - token
   */
  create: function (req, res) {
    const attr = {
      username: req.body.username,
      password: req.body.password
    };

    const session = new Session(attr);

    session.create().then(token => {
      res.json({token: token});
    }).catch(err => {
      res.status(400).json({errors: err.message});
    });
  }
};