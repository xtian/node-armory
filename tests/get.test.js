const test = require('tap').test;
const armory = require('../');

const IncomingMessage = require('http').IncomingMessage;
const Stream = require('stream').Stream;

let options = { locale: 'en_US', _query: {}, region: 'us' };

test('_get', (t) => {
  armory._get('/realm/status', options, (err, body, res) => {
    t.type(body, 'object', 'body was parsed from JSON');
    t.type(res, IncomingMessage, 'full response passed as third parameter');

    t.equal(res.req.getHeader('Host'), 'us.battle.net', 'built battle.net url');
    t.equal(res.req.path, '/api/wow/realm/status?locale=en_US', 'built api path');

    t.end();
  });
});

test('should throw if no region is provided', (t) => {
  let err = new Error('region must be provided');
  let fn = () => {
    armory._get('/realm/status', { _query: {} });
  };

  t.throws(fn, err, 'threw for undefined region');
  t.end();
});

test('should create Error object out of error reason', (t) => {
  armory._get('/0', options, function(err) {
    t.type(err, Error, 'Error passed as first param');
    t.end();
  });
});

test('should return Stream if no callback is passed', (t) => {
  let res = armory._get('/realm/status', options);

  t.type(res, Stream);
  t.end();
});

test('auth', (t) => {
  armory.auth.privateKey = armory.auth.publicKey = 'test';

  armory._get('/realm/status', options, (err, body, res) => {
    let time = new Date(res.req.getHeader('Date')).getTime();
    t.notOk(Number.isNaN(time), 'valid date header set');

    t.similar(res.req.getHeader('Authorization'), /BNET test:/, 'header set');
    t.end();
  });
});
