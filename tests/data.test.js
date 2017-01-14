const test = require('tap').test;
const armory = require('../');

const Stream = require('stream').Stream;

let options = { region: 'us' };

['battlegroups',
  'characterAchievements',
  'classes',
  'guildAchievements',
  'perks',
  'races',
  'rewards'
].forEach((method) => {

  test(`${method} should build correct url and output`, (t) => {
    armory[method](options, (err, body, res) => {
      t.notOk(err);
      t.type(body, Array);
      t.equal(res.statusCode, 200);
      t.end();
    });
  });

  test(`${method} should return Stream if no callback is passed`, (t) => {
    let res = armory[method](options);

    t.type(res, Stream);
    t.end();
  });
});
