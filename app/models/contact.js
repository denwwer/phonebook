const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phones: [{
    type: String,
    validate: [
      {
        validator: function (v) {
          const numbers = v.match(/[\d]/g).length;
          // test length
          if (numbers < 6 || numbers > 15) {
            return false;
          }
          // test common format
          return (/^\+?[- \.\(\)\d+\/]*$/).test(v);
        },
        message: '{VALUE} is not a valid phone number!'
      },
      {
        validator: function (v) {
          return (this.phones.filter(i => { return i === v; }).length <= 1);
        },
        message: '{VALUE} is duplicated phone number!'
      },
    ]
  }]
});

schema.set('toJSON', {
  transform: function (doc, ret, _options) {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret._id;
    return ret;
  }
});

schema.pre('validate', function (next) {
  this.phones.map((i) => {
    return i.trim();
  });
  next();
});

module.exports = mongoose.model('Contact', schema);