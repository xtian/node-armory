const request = require('request');
const url = require('url');
const utils = require('./utils');

const armory = {};

// Makes the request.
armory._get = function(path, options, callback) {
  options.jar = false;
  options.json = true;

  if (options.locale) {
    options._query.locale = options.locale;
  }

  if (!options.apiKey) {
    throw new Error('apiKey must be provided');
  }

  if (!options.region) {
    throw new Error('region must be provided');
  }

  options._query.apikey = options.apiKey

  options.uri = url.format({
    protocol: 'https:',
    hostname: `${options.region}.api.battle.net`,
    pathname: encodeURI(`/wow${path}`),
    query: options._query
  });

  let cb;

  if (callback) {
    cb = function(err, res, body) {
      if (body && body.status === 'nok') {
        err = err || new Error(body.reason);
      }

      callback.call(this, err, body, res);
    };
  }

  return request(options, cb);
};

// Retrieves object describing a battle pet.
armory.battlePetStats = function(options, callback) {
  let path = `/pet/stats/${options.id}`;

  options._query = utils.pick(options, ['breedId', 'level', 'qualityId']);

  return this._get(path, options, callback);
};

// Retrieves an array of challenge mode leaderboard information.
armory.challengeRegion = function(options, ...args) {
  options.id = 'region';
  return this.challenge(options, ...args);
};

// Retrieves array of realm status information.
armory.realmStatus = function(options, callback) {
  let path = '/realm/status';
  let cb;

  if (options.id) {
    options._query.realm = options.id;
  }

  if (callback) {
    cb = function(err, body, res) {
      let data = utils.getKey(body, 'realms');
      callback.call(this, err, data, res);
    };
  }

  return this._get(path, options, cb);
};

// Retrieves an object describing a character or guild.
['character', 'guild'].forEach(function(method) {
  armory[method] = function(options, callback) {
    if (options.fields) {
      options._query.fields = options.fields;
    }

    if (options.lastModified) {
      options.headers['If-Modified-Since'] = new Date(options.lastModified)
        .toUTCString();
    }

    let path = `/${method}/${options.realm}/${options.id}`;
    return this._get(path, options, callback);
  };
});

// Definitions for generic functions.
require('./methods').forEach(function(definition) {
  definition.url = definition.url || definition.method;

  armory[definition.method] = function(options, callback) {
    let id = options.id ? `/${options.id}` : '';
    let path = `/${definition.url}${id}`;
    let cb;

    if (callback && definition.key) {
      cb = function(err, body, res) {
        let data = utils.getKey(body, definition.key);
        callback.call(this, err, data, res);
      };
    } else {
      cb = callback;
    }

    return this._get(path, options, cb);
  };
});

module.exports = utils.wrap(armory, utils.initParams);
