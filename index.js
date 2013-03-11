var request = require('request')
  , crypto = require('crypto')
  , url = require('url')
  , utils = require('./utils')

var armory = { auth: { privateKey: null, publicKey: null } }

// Makes the request.
armory._get = function(path, options, callback) {
  options.headers = options.headers || {}
  options.jar = false
  options.json = true

  path = encodeURI('/api/wow' + path)

  if (options.locale) { options._query.locale = options.locale }
  if (!options.region) { throw new Error('region must be provided') }

  options.uri = url.format({
    protocol: 'http:'
  , hostname: options.region + '.battle.net'
  , pathname: path
  , query: options._query
  })

  // Authentication
  if (this.auth.privateKey && this.auth.publicKey) {
    var signature = crypto.createHmac('sha1', this.auth.privateKey)
      , date = new Date().toUTCString()

    signature.update(['GET', date, path].join('\n') + '\n')

    options.headers['Date'] = date
    options.headers['Authorization'] = 'BNET ' + this.auth.publicKey + ':' +
      signature.digest('base64')
  }

  if (callback) {
    var cb = function(err, res, body) {
      if (body && body.status === 'nok') {
        err = err || new Error(body.reason)
      }

      callback.call(this, err, body, res)
    }
  }

  return request(options, cb)
}

// Retrieves an object describing an arena team.
armory.arena = function(options, callback) {
  var path = '/arena/' + [options.realm, options.size, options.id].join('/')
  return this._get(path, options, callback)
}

// Retrieves an array of arena ladder information.
armory.arenaLadder = function(options, callback) {
  var path = '/pvp/arena/' + options.battlegroup + '/' + options.id

  options._query = utils.pick(options, ['asc', 'page', 'size'])

  if (callback) {
    var cb = function(err, body, res) {
      var data = utils.getKey(body, 'arenateam')
      callback.call(this, err, data, res)
    }
  }

  return this._get(path, options, cb)
}

// Retrieves object describing a battle pet.
armory.battlePetStats = function(options, callback) {
  var path = '/battlePet/stats/' + options.id

  options._query = utils.pick(options, ['breedId', 'level', 'qualityId'])

  return this._get(path, options, callback)
}

// Retrieves an array of challenge mode leaderboard information.
armory.challengeRegion = function(options) {
  options.id = 'region'
  return this.challenge.apply(this, arguments)
}

// Returns wrapped module where every method has default options applied
armory.defaults = function(defaults) {
  defaults.id = defaults.id || defaults.name
  delete defaults.name

  var wrapped = utils.wrap(this, function(fn, context) {
    return function(options, callback) {
      if (options.toString() === '[object Object]') {
        options = utils.merge(options, defaults)
        return fn.call(context, options, callback)
      }

      return utils.initParams(function(options, callback) {
        options = utils.merge(options, defaults)
        return fn.call(context, options, callback)

      }, context)(options, callback)
    }
  })

  return wrapped
}

// Retrieves an array of rated battleground ladder information.
armory.rbgLadder = function(options, callback) {
  var path = '/pvp/ratedbg/ladder'

  options._query = utils.pick(options, ['asc', 'page', 'size'])

  if (callback) {
    var cb = function(err, body, res) {
      var data = utils.getKey(body, 'bgRecord')
      callback.call(this, err, data, res)
    }
  }

  return this._get(path, options, cb)
}

// Retrieves array of realm status information.
armory.realmStatus = function(options, callback) {
  var path = '/realm/status'

  if (options.id) { options._query.realm = options.id }

  if (callback) {
    var cb = function(err, body, res) {
      var data = utils.getKey(body, 'realms')
      callback.call(this, err, data, res)
    }
  }

  return this._get(path, options, cb)
}

// Retrieves an object describing a character or guild.
;['character', 'guild'].forEach(function(method) {
  armory[method] = function(options, callback) {
    if (options.fields) { options._query.fields = options.fields }

    if (options.lastModified) {
      options.headers['If-Modified-Since'] = new Date(options.lastModified)
        .toUTCString()
    }

    var path = '/' + [method, options.realm, options.id].join('/')
    return this._get(path, options, callback)
  }
})

// Definitions for generic functions.
require('./methods').forEach(function(definition) {
  definition.url = definition.url || definition.method

  armory[definition.method] = function(options, callback) {
    var id = options.id ? '/' + options.id : ''
      , path = '/' + definition.url + id
      , cb

    if (definition.trailingSlash) { path += '/' }

    if (callback && definition.key) {
      cb = function(err, body, res) {
        var data = utils.getKey(body, definition.key)
        callback.call(this, err, data, res)
      }
    } else {
      cb = callback
    }

    return this._get(path, options, cb)
  }
})

module.exports = utils.wrap(armory, utils.initParams)
