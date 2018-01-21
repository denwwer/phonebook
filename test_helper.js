require('dotenv').config();
const db = require('./config/database');
let conn = null;

before(function(done) {
  conn = db.connect();
  conn.once('open', () => { done() });
});

after(function(done) {
  conn.close(() => { done() });
});

beforeEach(function(done) {
  conn.dropDatabase(() => { done() });
});