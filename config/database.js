const mongoose = require('mongoose');

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const options = {
  promiseLibrary: require('bluebird')
};

mongoose.connect(url, options);

module.exports = {
  connect: function () {
    const db = mongoose.connection;
    db.on('error', (err) => { console.error(err) });
    db.once('open', () => { console.log('Connected to MongoDB') });
    return db;
  }
};