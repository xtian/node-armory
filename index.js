const request = require('request');
const url = require('url');
const utils = require('./utils');

const armory = {};

// Makes the request.
armory._get = (path, options, callback) => {
  if (!options.apiKey) {
    throw new Error('apiKey must be provided');
  }

  if (!options.region) {
    throw new Error('region must be provided');
  }

  if (options.locale) {
    options._query.locale = options.locale;
  }

  options.jar = false;
  options.json = true;
  options._query.apikey = options.apiKey;
  options.uri = url.format({
    protocol: 'https:',
    hostname: `${options.region}.api.battle.net`,
    pathname: encodeURI(`/wow${path}`),
    query: options._query
  });

  let cb;

  if (callback) {
    cb = (err, res, body) => {
      if (res.statusCode > 399 && body) {
        err = err || new Error(body.detail);
      }

      callback(err, body, res);
    };
  }

  return request(options, cb);
};

// Retrieves object describing a battle pet.
armory.battlePetStats = (options, callback) => {
  let path = `/pet/stats/${options.id}`;

  options._query = utils.pick(options, ['breedId', 'level', 'qualityId']);

  return armory._get(path, options, callback);
};

// Retrieves an array of challenge mode leaderboard information.
armory.challengeRegion = (options, ...args) => {
  options.id = 'region';
  return armory.challenge(options, ...args);
};

// Retrieves array of realm status information.
armory.realmStatus = (options, callback) => {
  let path = '/realm/status';
  let cb;

  if (options.id) {
    options._query.realm = options.id;
  }

  if (callback) {
    cb = (err, body, res) => {
      let data = utils.getKey(body, 'realms');
      callback(err, data, res);
    };
  }

  return armory._get(path, options, cb);
};

// Retrieves an object describing a character or guild.
['character', 'guild'].forEach((method) => {
  armory[method] = (options, callback) => {
    if (options.fields) {
      options._query.fields = options.fields;
    }

    if (options.lastModified) {
      options.headers['If-Modified-Since'] = new Date(options.lastModified)
        .toUTCString();
    }

    let path = `/${method}/${options.realm}/${options.id}`;
    return armory._get(path, options, callback);
  };
});

// Definitions for generic functions.
require('./methods').forEach((definition) => {
  definition.url = definition.url || definition.method;

  armory[definition.method] = (options, callback) => {
    let id = options.id ? `/${options.id}` : '';
    let path = `/${definition.url}${id}`;
    let cb = callback;

    if (callback && definition.key) {
      cb = (err, body, res) => {
        let data = utils.getKey(body, definition.key);
        callback(err, data, res);
      };
    }

    return armory._get(path, options, cb);
  };
});

module.exports = utils.wrap(armory, utils.initParams);
