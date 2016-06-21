'use strict';

const BPromise = require('bluebird');
const Log      = require('./models').Log;

module.exports = (input_stream) => {
  return new BPromise((resolve, reject) => {
    let log_contents = '';
    input_stream.on('data', chunk => {
      log_contents += chunk.toString();
    })
    .on('end', _ => {
      resolve(Log.create({ text: log_contents }));
    })
    .on('error', error => {
      reject(error);
    });
  });
};
