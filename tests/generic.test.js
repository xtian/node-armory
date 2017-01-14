const test = require('tap').test;
const armory = require('../');

const Stream = require('stream').Stream;

test('achievement', (t) => {
  let options = { id: 1705, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.achievement(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/achievement/1705');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.achievement(options);

    t.type(res, Stream);
    t.end();
  });
});

test('auction', (t) => {
  let options = { id: 'shadowmoon', region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.auction(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/auction/data/shadowmoon');
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.auction(options);

    t.type(res, Stream);
    t.end();
  });
});

test('challenge', (t) => {
  let options = { id: 'shadowmoon', region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.challenge(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/challenge/shadowmoon');
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.challenge(options);

    t.type(res, Stream);
    t.end();
  });
});

test('challengeRegion', (t) => {
  let options = { region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.challengeRegion(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/challenge/region');
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.challengeRegion(options);

    t.type(res, Stream);
    t.end();
  });
});

test('item', (t) => {
  let options = { id: 28041, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.item(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/item/28041');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.item(options);

    t.type(res, Stream);
    t.end();
  });
});

test('itemSet', (t) => {
  let options = { id: 650, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.itemSet(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/item/set/650');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.itemSet(options);

    t.type(res, Stream);
    t.end();
  });
});

test('quest', (t) => {
  let options = { id: 11549, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.quest(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/quest/11549');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.quest(options);

    t.type(res, Stream);
    t.end();
  });
});

test('recipe', (t) => {
  let options = { id: 33288, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.recipe(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/recipe/33288');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.recipe(options);

    t.type(res, Stream);
    t.end();
  });
});

test('spell', (t) => {
  let options = { id: 6197, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.spell(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/spell/6197');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.spell(options);

    t.type(res, Stream);
    t.end();
  });
});
