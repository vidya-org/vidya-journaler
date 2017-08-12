'use strict';

const Bluebird = require('bluebird');
const Log      = require('./models').Log;

module.exports = (input_stream) => {
  return new Bluebird((resolve, reject) => {
    let log_contents = '';
    input_stream.on('data', chunk => {
      log_contents += chunk.toString();
    })
      .on('end', () => {
        resolve(Log.create({ text: log_contents }));
      })
      .on('error', error => {
        reject(error);
      });
  });
};
