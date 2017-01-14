// Returns the value of an object's key if it exists.
exports.getKey = function(obj, key) {
  if (obj && obj[key] != null) {
    return obj[key];
  } else {
    return obj;
  }
};

// Returns a new instance of the module with a wrapper applied.
exports.wrap = function(target, wrapper) {
  let wrapped = {
    auth: target.auth,
    defaults: target.defaults,
    _get: target._get
  };

  for (let prop in target) {
    if (wrapped[prop] === undefined) {
      wrapped[prop] = wrapper(target[prop], target);
    }
  }

  return wrapped;
};

// A wrapper to initialize the options object.
exports.initParams = function(fn, context) {
  return function(options, callback) {
    let newOptions = {};

    if (typeof options === 'object' && !Array.isArray(options)) {
      newOptions = options;
      newOptions.id = options.id || options.name;

    } else if (typeof options === 'function') {
      callback = options;
      newOptions = {};

    } else {
      newOptions.id = options;
    }

    newOptions.headers = newOptions.headers || {};
    newOptions._query = {};

    return fn.call(context, newOptions, callback);
  };
};

// Returns new object with specific keys copied from passed object
exports.pick = function(obj, keys) {
  return keys.reduce(function(cumm, key) {
    cumm[key] = obj[key];
    return cumm;
  }, {});
};
