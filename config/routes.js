const express = require('express');
const router = express.Router();

const User = require('../app/resources/user');
const Session = require('../app/resources/session');
const Contact = require('../app/resources/contact');

router.get('/', (req, res) => { res.sendStatus(200); });
router.post('/user', User.create);
router.post('/user/sessions', Session.create);
router.get('/contacts', Contact.all);
router.post('/contacts', Contact.create);
router.post('/contacts/:id', Contact.update);
router.delete('/contacts/:id', Contact.delete);
router.post('/contacts/:id/entries', Contact.addPhone);

module.exports = router;