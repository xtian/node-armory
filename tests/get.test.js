const test = require('tap').test;
const armory = require('../');

test('throws if region is not provided', (t) => {
  let err = new Error('region must be provided');
  let fn = () => armory._get('/realm/status', { _query: {}, apiKey: 'foo' });

  t.throws(fn, err);
  t.end();
});

test('throws if apiKey is not provided', (t) => {
  let err = new Error('apiKey must be provided');
  let fn = () => armory._get('/realm/status', { _query: {}, region: 'foo' });

  t.throws(fn, err);
  t.end();
});

test('creates Error object out of error reason', (t) => {
  let options = { apiKey: 'foo', _query: {}, region: 'us' };

  armory._get('/0', options, (err) => {
    t.type(err, Error);
    t.end();
  });
});
