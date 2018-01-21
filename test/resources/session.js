const chai = require('chai'),
      assert = chai.assert,
      chaiHttp = require('chai-http'),
      User = require('../../app/models/user');
      app = require('../../app');

chai.use(chaiHttp);

describe('API /user/session', function() {
  describe('.create', function () {
    const attr = { username: 'user1', password: 'pass' };
    let user = null;

    beforeEach(function (done) {
      user = new User(attr);

      user.save().then((u) => {
        user = u;
        done();
      }).catch(err => { console.log(err); });
    });

    it('should create session', function (done) {
      chai.request(app)
        .post('/user/sessions')
        .send(attr)
        .end(function (err, res) {
          assert.equal(res.body.token, user.token);
          assert.equal(res.statusCode, 200);
          done();
        });
    });

    it('user params in not valid', function (done) {
      chai.request(app)
        .post('/user/sessions')
        .send({ username: '', password: 'pass1' })
        .end(function (err, res) {
          assert.match(res.body.errors, /Incorrect username or password/);
          assert.equal(res.statusCode, 400);
          done();
        });
    });
  });
});