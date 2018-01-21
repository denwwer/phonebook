const User = require('../models/user');

module.exports = {
  /**
   * Create User
   * @param req
   * @param res
   */
  create: function (req, res) {
    const attr = {
      username: req.body.username,
      password: req.body.password
    };

    const user = new User(attr);

    user.save((err, _u) => {
      if (err) {
        res.status(400).json({errors: err.message});
      } else {
        res.status(201).json({});
      }
    });
  }
};