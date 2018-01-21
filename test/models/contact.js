const chai = require('chai'),
  assert = chai.assert,
  Contact = require('../../app/models/contact'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId();

const attr = { user: ObjectId, first_name: 'Mack', last_name: 'Deu' };

describe('Model Contact', function () {
  it('should prevent duplication', function () {
    const contact = new Contact(attr);
    const phone = '+1 (555) 123-450';

    return contact.save().then(record => {
      return Contact.findById(record._id);
    }).then(record => {
      record.phones.push(phone);
      return record.save();
    }).then(record => {
      return Contact.findById(record._id);
    }).then(record => {
      assert.deepEqual(record.phones, [phone]);
      record.phones.push(phone);
      record.save(err => {
        assert.match(err, /duplicated phone number/);
      });
    });
  });

  it('should validate', function (done) {
    const contact = new Contact(attr);
    contact.phones.push('+12 455');
    contact.save(err => {
      assert.match(err.message, /not a valid phone number/);
      done();
    });
  });
});