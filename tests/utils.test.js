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
  let obj = {
    auth: { privateKey: 0, publicKey: 0 },
    defaults: 1,
    _get: 1,
    key: 1
  };

  let wrapper = function(val) {
    return val + 1;
  };

  let wrapped = utils.wrap(obj, wrapper);

  t.equal(wrapped.key, 2, 'got key with wrapper applied');
  t.equal(wrapped.auth, obj.auth, 'auth excluded from wrapper');
  t.equal(wrapped.defaults, 1, 'defaults excluded from wrapper');
  t.equal(wrapped._get, 1, '_get excluded from wrapper');

  t.end();
});

test('initParams', (t) => {
  t.type(utils.initParams(), 'function', 'returned wrapped function');

  t.test('should initialize options object if callback passed', (t) => {
    let fn = utils.initParams(function(options) {
      t.type(options, 'object', 'options was initialized');
      t.type(options.headers, 'object', 'headers was initialized');
      t.type(options._query, 'object', '_query was initialized');
    });

    fn(function() {});
    t.end();
  });

  t.test('should set the id prop if options object not passed', (t) => {
    let fn = utils.initParams(function(options) {
      t.equal(options.id, 1, 'id property was set to passed number param');
    });

    fn(1);
    t.end();
  });

  t.test('should set the id prop if array passed', (t) => {
    let fn = utils.initParams(function(options) {
      t.deepEqual(options.id, [1], 'id property was set to passed array param');
    });

    fn([1]);
    t.end();
  });

  t.test('should copy name prop to id prop', (t) => {
    let fn = utils.initParams(function(options) {
      t.equal(options.id, 1, 'id was set to value of name property');
    });

    fn({ name: 1 });
    t.end();
  });

  t.test('should call function with the passed context', (t) => {
    let self = {};
    let fn = utils.initParams(function() {
      t.equal(this, self, 'this value was equal to passed context param');
    }, self);

    fn({});
    t.end();
  });

  t.end();
});

test('pick', (t) => {
  let obj = { one: 1, two: 2, three: 3 };
  let picked = utils.pick(obj, ['one', 'three']);

  t.equal(picked.one, 1, '"one" was copied to new object');
  t.equal(picked.two, undefined, '"two" was not copied to new object');
  t.equal(picked.three, 3, '"three" was copied to new object');
  t.end();
});
