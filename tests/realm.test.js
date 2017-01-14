const test = require('tap').test;
const armory = require('../');

const Stream = require('stream').Stream;

test('realmStatus', (t) => {
  let options = { id: 'shadowmoon', region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.realmStatus(options, (err, body, res) => {
      t.notOk(err);

      t.equal(
        res.req.path,
        '/api/wow/realm/status?realm=shadowmoon'
      );

      t.equal(options._query.realm, 'shadowmoon', 'realm query param set');
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.equal(body.length, 1, 'returned one realm');

      t.end();
    });
  });

  t.test('should accept array of realms', (t) => {
    let options = { id: ['shadowmoon', 'nazgrel'], region: 'us' };

    armory.realmStatus(options, function(err, body) {
      t.notOk(err);

      t.similar(
        options._query.realm,
        ['shadowmoon', 'nazgrel'],
        'realm query param set'
      );

      t.type(body, Array);
      t.equal(body.length, 2, 'returned two realms');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.realmStatus(options);

    t.type(res, Stream);
    t.end();
  });
});
