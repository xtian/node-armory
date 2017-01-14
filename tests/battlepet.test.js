const test = require('tap').test;
const armory = require('../');
const Stream = require('stream').Stream;

require('dotenv').config();
const defaults = { apiKey: process.env.ARMORY_API_KEY };

test('battlePetAbility', (t) => {
  let options = Object.assign(defaults, { id: 222, region: 'us' });

  t.test('makes successful request', (t) => {
    armory.battlePetAbility(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.id, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.battlePetAbility(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('battlePetSpecies', (t) => {
  let options = Object.assign(defaults, { id: 640, region: 'us' });

  t.test('makes successful request', (t) => {
    armory.battlePetSpecies(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.speciesId, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.battlePetSpecies(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});

test('battlePetStats', (t) => {
  let options = Object.assign(defaults, {
    id: 258,
    breedId: 5,
    level: 25,
    qualityId: 4,
    region: 'us'
  });

  t.test('makes successful request', (t) => {
    armory.battlePetStats(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(body.speciesId, options.id);
      t.end();
    });
  });

  t.test('returns a Stream if no callback is passed', (t) => {
    let res = armory.battlePetStats(options);

    t.type(res, Stream);
    t.end();
  });

  t.end();
});
