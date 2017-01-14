const test = require('tap').test;
const armory = require('../');

const Stream = require('stream').Stream;

test('arena', (t) => {
  let options = {
    name: 'Staker cheated on his GF',
    realm: 'shadowmoon',
    region: 'us',
    size: '5v5'
  };

  t.test('should build correct url and response', (t) => {
    armory.arena(options, (err, body, res) => {
      t.notOk(err);

      t.equal(
        res.req.path,
        '/api/wow/arena/shadowmoon/5v5/Staker%20cheated%20on%20his%20GF'
      );

      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.arena(options);

    t.type(res, Stream);
    t.end();
  });
});

test('arenaLadder', (t) => {
  let options = {
    battlegroup: 'vindication',
    id: '2v2',
    region: 'us',
    asc: false,
    page: 2,
    size: 10
  };

  t.test('should build correct url and response', (t) => {
    armory.arenaLadder(options, (err, body, res) => {
      t.notOk(err);

      t.equal(
        res.req.path,
        '/api/wow/pvp/arena/vindication/2v2?asc=false&page=2&size=10'
      );

      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.arenaLadder(options);

    t.type(res, Stream);
    t.end();
  });
});

test('rbgLadder', (t) => {
  let options = {
    region: 'us',
    asc: false,
    page: 2,
    size: 10
  };

  t.test('should build correct url and response', (t) => {
    armory.rbgLadder(options, (err, body, res) => {
      t.notOk(err);

      t.equal(
        res.req.path,
        '/api/wow/pvp/ratedbg/ladder?asc=false&page=2&size=10'
      );

      t.equal(options._query.asc, false, 'asc query param set');
      t.equal(options._query.page, 2, 'page query param set');
      t.equal(options._query.size, 10, 'size query param set');

      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.rbgLadder(options);

    t.type(res, Stream);
    t.end();
  });
});
