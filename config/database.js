const mongoose = require('mongoose');

const uri = (process.env.NODE_ENV === 'production') ? process.env.DB_URI : process.env.DB_URI_SANDBOX;
const options = {
  promiseLibrary: require('bluebird')
};

mongoose.connect(uri, options);

module.exports = {
  connect: function () {
    const db = mongoose.connection;
    db.on('error', (err) => { console.error(err); });
    db.once('open', () => { console.log('Connected to MongoDB'); });
    return db;
  }
};