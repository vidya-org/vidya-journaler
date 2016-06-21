'use strict';

const http = require('http');
const path = require('path');
const url  = require('url');
const auth = require('http-auth');
const Log  = require('./lib/models').Log;
const HttpStatusCodes = require('http-status-codes');

const basic_auth = auth.basic({
  realm: 'Vidya',
  file:  path.join(__dirname, '/test/test_files/htpasswd')
});

const app = (request, response) => {
  const target_url = url.parse(request.url);

  if (target_url.path !== '/') {
    return reject_connection(response, HttpStatusCodes.NOT_FOUND);
  }

  if (request.method !== 'PUT') {
    return reject_connection(response, HttpStatusCodes.METHOD_NOT_ALLOWED);
  }

  let log_contents = '';

  request.on('data', chunk => {
    log_contents += chunk.toString();
  });
  request.on('end', _ => {
    Log.create({ text: log_contents })
      .then(_ => {
        response.writeHead(HttpStatusCodes.OK, {'Content-Type': 'text/plain'});
        response.end();
      })
      .catch(_ => {
        reject_connection(response, HttpStatusCodes.INTERNAL_SERVER_ERROR);
      });
  });
};

function reject_connection (response, status) {
  response.writeHead(status, {'Content-Type': 'text/plain'});
  return response.end();
}

module.exports = http.createServer(basic_auth, app);
