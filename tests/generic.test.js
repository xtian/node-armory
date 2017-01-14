const test = require('tap').test;
const armory = require('../');
const Stream = require('stream').Stream;

require('dotenv').config();
let defaults = { region: 'us', apiKey: process.env.ARMORY_API_KEY };

test('achievement', (t) => {
  let options = Object.assign(defaults, { id: 1705 });

  t.test('makes successful request', (t) => {
    armory.achievement(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.achievement(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('auction', (t) => {
  let options = Object.assign(defaults, { id: 'shadowmoon' });

  t.test('makes successful request', (t) => {
    armory.auction(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.auction(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('challenge', (t) => {
  let options = Object.assign(defaults, { id: 'shadowmoon' });

  t.test('makes successful request', (t) => {
    armory.challenge(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.challenge(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('challengeRegion', (t) => {
  t.test('makes successful request', (t) => {
    armory.challengeRegion(defaults, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.challengeRegion(defaults);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('item', (t) => {
  let options = Object.assign(defaults, { id: 28041 });

  t.test('makes successful request', (t) => {
    armory.item(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.item(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('itemSet', (t) => {
  let options = Object.assign(defaults, { id: 650 });

  t.test('makes successful request', (t) => {
    armory.itemSet(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.itemSet(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('quest', (t) => {
  let options = Object.assign(defaults, { id: 11549 });

  t.test('makes successful request', (t) => {
    armory.quest(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.quest(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('recipe', (t) => {
  let options = Object.assign(defaults, { id: 33288 });

  t.test('makes successful request', (t) => {
    armory.recipe(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.recipe(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('spell', (t) => {
  let options = Object.assign(defaults, { id: 6197 });

  t.test('makes successful request', (t) => {
    armory.spell(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.spell(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});
