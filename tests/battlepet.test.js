const test = require('tap').test;
const armory = require('../');

const Stream = require('stream').Stream;

test('battlePetAbility', (t) => {
  let options = { id: 222, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.battlePetAbility(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/battlePet/ability/222');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.battlePetAbility(options);

    t.type(res, Stream);
    t.end();
  });
});

test('battlePetSpecies', (t) => {
  let options = { id: 444, region: 'us' };

  t.test('should build correct url and response', (t) => {
    armory.battlePetSpecies(options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.req.path, '/api/wow/battlePet/species/444');
      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.battlePetSpecies(options);

    t.type(res, Stream);
    t.end();
  });
});

test('battlePetStats', (t) => {
  let options = {
    id: 258,
    breedId: 5,
    level: 25,
    qualityId: 4,
    region: 'us'
  };

  t.test('should build correct url and response', (t) => {
    armory.battlePetStats(options, (err, body, res) => {
      t.notOk(err);

      t.equal(
        res.req.path,
        '/api/wow/battlePet/stats/258?breedId=5&level=25&qualityId=4'
      );

      t.equal(res.statusCode, 200);
      t.type(body, 'object');
      t.end();
    });
  });

  t.test('should return a Stream if no callback is passed', (t) => {
    let res = armory.battlePetStats(options);

    t.type(res, Stream);
    t.end();
  });
});
