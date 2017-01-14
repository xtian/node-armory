const test = require('tap').test;
const armory = require('../');

test('should merge options with defaults', (t) => {
  armory.realmStatus = function(options) {
    t.equal(options.region, 'us');
    t.equal(options.id, 0);
    t.end();
  };

  armory.defaults({ region: 'us' }).realmStatus({ id: 0 }, () => {});
});

test('should merge id param with defaults', (t) => {
  armory.realmStatus = function(options) {
    t.equal(options.region, 'us');
    t.equal(options.id, 0);
    t.end();
  };

  armory.defaults({ region: 'us' }).realmStatus(0, () => {});
});
