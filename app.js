'use strict';

const http = require('http');
const path = require('path');
const url  = require('url');
const auth = require('http-auth');
const HttpStatusCodes = require('http-status-codes');
const stream_file_to_bd = require('./lib/stream_file_to_bd');

const basic_auth = auth.basic({
  realm: 'Vidya',
  file:  path.join(__dirname, '/test/test_files/htpasswd')
});

const app = (request, response) => {
  const target_url = new url.URL(request.url, 'http://localhost');

  if (target_url.pathname !== '/') {
    return reject_connection(response, HttpStatusCodes.NOT_FOUND);
  }

  if (request.method !== 'PUT') {
    return reject_connection(response, HttpStatusCodes.METHOD_NOT_ALLOWED);
  }

  stream_file_to_bd(request)
    .then(_ => {
      response.writeHead(HttpStatusCodes.OK, { 'Content-Type': 'text/plain' });
      response.end();
    })
    .catch(_ => {
      reject_connection(response, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });
};

function reject_connection (response, status) {
  response.writeHead(status, { 'Content-Type': 'text/plain' });
  return response.end();
}

module.exports = http.createServer(basic_auth.check(app));
