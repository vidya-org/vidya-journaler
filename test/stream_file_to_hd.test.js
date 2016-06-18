'use strict';

const expect = require('chai').expect;

const stream_file_to_hd = require('../lib/stream_file_to_hd');

describe('Stream file to hd', _ => {
  describe('calling the function', _ => {

    it('should return a promise', () => {
      expect(stream_file_to_hd().then).to.exist;
    });
  });
});
