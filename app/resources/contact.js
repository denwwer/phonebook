const _ = require('lodash');
const Contact = require('../models/contact');

module.exports = {
  /**
   * Get all Contacts
   * @param req
   * @param res
   * @returns {array} - Contacts
   */
  all: function (req, res) {
    Contact.where({user: req.User._id}).select('-user').exec((err, contacts) => {
      if (err) {
        log.error(err);
        res.status(400).json({errors: err.message});
      } else {
        res.json(contacts);
      }
    });
  },

  /**
   * Create Contact
   * @param req
   * @param res
   * @returns {object} - contact ID
   */
  create: function (req, res) {
    const attr = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      user: req.User._id
    };

    const contact = new Contact(attr);

    contact.save((err, record) => {
      if (err) {
        log.error(err);
        res.status(400).json({errors: err.message});
      } else {
        res.status(201).json({id: record._id});
      }
    });
  },

  /**
   * Update Contact
   * @param req
   * @param res
   * @returns {object} - contact ID
   */
  update: function (req, res) {
    let attr = {
      first_name: req.body.first_name,
      last_name: req.body.last_name
    };

    attr = _.pickBy(attr, _.isString);
    const arg = { _id: req.params.id, user: req.User._id };
    const opt = {fields: 'first_name last_name', runValidators: true};

    Contact.update(arg, attr, opt).exec((err, raw) => {
      if (raw.nModified === 0) {
        return res.status(400).json({errors: 'Contact not exist'});
      }

      if (err) {
        log.error(err);
        res.status(400).json({errors: err.message});
      } else {
        res.json({id: arg._id});
      }
    });
  },

  /**
   * Delete Contact
   * @param req
   * @param res
   */
  delete: function (req, res) {
    const arg = { _id: req.params.id, user: req.User._id };

    Contact.findOneAndRemove(arg).exec((err) => {
      if (err) {
        log.error(err);
        res.status(400).json({errors: err.message});
      } else {
        res.status(204).json({});
      }
    });
  },

  /**
   * Add phone number
   * @param req
   * @param res
   * @returns {object} - contact ID
   */
  addPhone: function (req, res) {
    const arg = { _id: req.params.id, user: req.User._id };

    Contact.findOne(arg).select('phones').then(record => {
      if (!record) {
        throw new Error('Contact not exist');
      }

      record.phones.push(req.body.phone);
      return record.save();
    }).then((record) => {
      res.status(201).json({id: record._id});
    }).catch(err => {
      log.error(err);
      res.status(400).json({errors: err.message});
    });
  }
};