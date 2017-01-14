const test = require('tap').test;
const armory = require('../');
const Stream = require('stream').Stream;

require('dotenv').config();
let defaults = { region: 'us', apiKey: process.env.ARMORY_API_KEY };

test('realmStatus', (t) => {
  let options = Object.assign(defaults, { id: 'shadowmoon' });

  t.test('makes successful request', (t) => {
    armory.realmStatus(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.equal(body.length, 1, 'returned one realm');

      t.end();
    });
  });

  t.test('should accept array of realms', (t) => {
    let options = Object.assign(defaults, { id: ['shadowmoon', 'nazgrel'] });

    armory.realmStatus(options, function(err, body) {
      t.notOk(err);
      t.type(body, Array);
      t.equal(body.length, 2, 'returned two realms');
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.realmStatus(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});
