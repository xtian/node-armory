const test = require('tap').test;
const armory = require('../');
const Stream = require('stream').Stream;

require('dotenv').config();
let options = { region: 'us', apiKey: process.env.ARMORY_API_KEY };

[
  'battlegroups',
  'characterAchievements',
  'classes',
  'guildAchievements',
  'perks',
  'races',
  'rewards'
].forEach((method) => {

  test(`${method} makes successful request`, (t) => {
    armory[method](options, (err, body, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.type(body, Array);
      t.end();
    });
  });

  test(`${method} returns a Stream if no callback is passed`, (t) => {
    let res = armory[method](options);

    t.type(res, Stream);
    t.end();
  });

});
