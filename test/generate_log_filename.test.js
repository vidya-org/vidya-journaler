'use strict';

const crypto = require('crypto');
const expect = require('chai').expect;

const generate_log_filename = require('../lib/generate_log_filename');

describe('Filename generator', _ => {
  describe('the generated filename', _ => {
    let generated_filename;
    const hash = crypto.createHash('md5').update('filename generator test').digest('hex');
    before(done => {
      generated_filename = generate_log_filename(hash);
      done();
    });

    it('should have 4 fields separated by underscore', done => {
      const fields = generated_filename.split('_');

      expect(fields).to.have.lengthOf(4);

      done();
    });

    it('should have \'log\' as the first field', done => {
      const first_field = generated_filename.split('_')[0];

      expect(first_field).to.be.equal('log');

      done();
    });

    it('should have a numeric timestamp as the second field', done => {
      const second_field = generated_filename.split('_')[1];

      expect(second_field).to.match(/^[0-9]+$/);

      done();
    });

    it('should have a random number as the third field', done => {
      const third_field = generated_filename.split('_')[2];

      expect(third_field).to.match(/^[0-9]+[.][0-9]+$/);

      done();
    });
  });
});
