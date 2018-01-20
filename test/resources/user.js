const chai = require('chai'),
      assert = chai.assert,
      chaiHttp = require('chai-http'),
      User = require('../../app/models/user');
      app = require('../../app');

chai.use(chaiHttp);

describe('API /user', function() {
  describe('.create', function () {
    it('should save user', function (done) {
      chai.request(app)
        .post('/user')
        .send({ username: 'user1', password: '123' })
        .end(function (err, res) {
          assert.lengthOf(Object.keys(res.body), 0);
          assert.equal(res.statusCode, 201);
          done();
        });
    });

    it('user params in not valid', function (done) {
      chai.request(app)
        .post('/user')
        .send({ username: 'user1', password: '' })
        .end(function (err, res) {
          assert.match(res.body.errors, /Path `password` is required/);
          assert.equal(res.statusCode, 400);
          done();
        });
    });

    it('username is not uniq', function (done) {
      const attr = { username: 'user1', password: 'pass' };
      const user = new User(attr);

      user.save().then(() => {
        chai.request(app).post('/user')
          .send(attr)
          .end(function (err, res) {
            assert.match(res.body.errors, /`username` is not uniq/);
            assert.equal(res.statusCode, 400);
            done();
          });
        }).catch(err => { console.log(err) });
    });
  });
});