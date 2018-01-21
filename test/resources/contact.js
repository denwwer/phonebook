const chai = require('chai'),
  assert = chai.assert,
  chaiHttp = require('chai-http'),
  User = require('../../app/models/user');
  Contact = require('../../app/models/contact');
  app = require('../../app');

chai.use(chaiHttp);

function createUser(attr) {
  user = new User(attr || {username: 'user1', password: 'pass'});
  return user.save();
}

function createContacts(attr) {
  cont = new Contact(attr);
  return cont.save();
}

describe('API /contacts', function() {
  it('unauthorized', function (done) {
    chai.request(app)
      .get('/contacts')
      .end(function (err, res) {
        assert.lengthOf(Object.keys(res.body), 0);
        assert.equal(res.statusCode, 401);
        done();
      });
  });

  describe('.all', function () {
    it('should return contacts', function (done) {
      let user = null;

      createUser().then(_user => {
        user = _user;
        const attr = { user: _user, first_name: 'Mack', last_name: 'Deu' };
        return createContacts(attr);
      }).then(contact => {
        chai.request(app)
          .get('/contacts')
          .set('Token', user.token)
          .end(function (err, res) {
            const json = contact.toJSON();
            const attr = ['phones', 'first_name', 'last_name', 'id'];

            for (let i = 0; i < attr.length; i++) {
              let k = attr[i];
              let eq = null;

              if (typeof json[k] === 'object') {
                eq = assert.deepEqual;
              } else {
                eq = assert.equal;
              }

              eq(json[k], res.body[0][k]);
            }

            assert.equal(res.statusCode, 200);
            done();
          });
      });
    });
  });

  describe('.create', function () {
    it('should create', function (done) {
      createUser().then(user => {
        const attr = { first_name: 'Alex', last_name: 'Alli' };

        chai.request(app)
          .post('/contacts')
          .set('Token', user.token)
          .send(attr)
          .end(function (err, res) {
            Contact.findOne({user: user._id}).select('_id').exec((err, record) => {
              assert.equal(res.body.id, record._id);
              assert.equal(res.statusCode, 201);
              done();
            });
          });
      });
    });
  });

  describe('.update', function () {
    it('should update', function (done) {
      let user = null;

      createUser().then(_user => {
        user = _user;
        const attr = { user: _user, first_name: 'Mack', last_name: 'Deu' };
        return createContacts(attr);
      }).then(contact => {
        const attr = { first_name: 'Alex' };

        chai.request(app)
          .post(`/contacts/${contact._id}`)
          .set('Token', user.token)
          .send(attr)
          .end(function (err, res) {
            Contact.findOne({_id: contact._id}).exec((err, record) => {
              assert.equal(record.first_name, attr.first_name);
              assert.equal(record.last_name, 'Deu');
              assert.equal(res.body.id, record._id);
              assert.equal(res.statusCode, 200);
              done();
            });
          });
      });
    });
  });

  describe('.delete', function () {
    it('should delete', function (done) {
      let user = null;

      createUser().then(_user => {
        user = _user;
        const attr = { user: _user, first_name: 'Mack', last_name: 'Deu' };
        return createContacts(attr);
      }).then(contact => {
        chai.request(app)
          .delete(`/contacts/${contact._id}`)
          .set('Token', user.token)
          .end(function (err, res) {
            Contact.where({_id: contact._id}).count().exec((err, count) => {
              assert.equal(count, 0);
              assert.equal(res.statusCode, 204);
              done();
            });
          });
      });
    });
  });

  describe('.addPhone', function () {
    it('should save', function (done) {
      createUser().then(_user => {
        user = _user;
        const attr = { user: _user, first_name: 'Mack', last_name: 'Deu', phones: ['+49 1245 154875'] };
        return createContacts(attr);
      }).then(contact => {
        chai.request(app)
          .post(`/contacts/${contact._id}/entries`)
          .set('Token', user.token)
          .send({phone: '+1 (555) 123-456'})
          .end(function (err, res) {
            Contact.findOne({_id: contact._id}).select('phones').exec((err, record) => {
              assert.deepEqual(record.phones, ['+49 1245 154875', '+1 (555) 123-456']);
              assert.equal(res.statusCode, 201);
              done();
            });
          });
      });
    });
  });
});