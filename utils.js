// Returns the value of an object's key if it exists.
exports.getKey = (obj, key) => {
  if (obj && obj[key]) {
    return obj[key];
  } else {
    return obj;
  }
};

// Returns a new instance of the module with a wrapper applied.
exports.wrap = (target, wrapper) => {
  let wrapped = { _get: target._get };

  for (let prop in target) {
    if (wrapped[prop] === undefined) {
      wrapped[prop] = wrapper(target[prop]);
    }
  }

  return wrapped;
};

// A wrapper to initialize the options object.
exports.initParams = (fn) => {
  return (options, callback) => {
    options.id = options.id || options.name;
    options._query = {};

    return fn(options, callback);
  };
};

// Returns new object with specific keys copied from passed object
exports.pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
};
