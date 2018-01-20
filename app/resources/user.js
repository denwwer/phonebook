const User = require('../models/user');

module.exports = {
  create: function (req, res) {
    const user = new User({ username: req.body.username,  password: req.body.password });

    user.save(function (err) {
      if (err) {
        // console.error(err);
        res.status(400).json({errors: err.message});
      } else {
        res.status(201).json({});
      }
    });
  }
};