const test = require('tap').test;
const utils = require('../utils');

test('getKey', (t) => {
  let obj = { key: 'value', 'null': null };

  t.equal(utils.getKey(obj, 'key'), 'value', 'got value of key');
  t.equal(utils.getKey(obj, 'null'), obj, 'got obj because key was null');
  t.equal(utils.getKey(obj, 'blank'), obj, 'got obj because key was undefined');
  t.equal(utils.getKey(), undefined, 'got undefined because obj was missing');

  t.end();
});

test('wrap', (t) => {
  let obj = { _get: 1, key: 1 };
  let wrapper = (val) => val + 1;
  let wrapped = utils.wrap(obj, wrapper);

  t.equal(wrapped.key, 2, 'got key with wrapper applied');
  t.equal(wrapped._get, 1, '_get excluded from wrapper');

  t.end();
});

test('initParams', (t) => {
  t.type(utils.initParams(), 'function', 'returned wrapped function');

  t.test('should initialize options', (t) => {
    let fn = utils.initParams((options) => {
      t.type(options._query, 'object', '_query was initialized');
    });

    fn({});
    t.end();
  });

  t.test('should copy name prop to id prop', (t) => {
    let fn = utils.initParams((options) => {
      t.equal(options.id, 1);
    });

    fn({ name: 1 });
    t.end();
  });

  t.end();
});

test('pick', (t) => {
  let obj = { one: 1, two: 2, three: 3 };
  let picked = utils.pick(obj, ['one']);

  t.equal(picked.one, 1);
  t.equal(picked.two, undefined);
  t.end();
});
