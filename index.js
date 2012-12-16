var request = require('request')
  , crypto = require('crypto')

var armory = { privateKey: null, publicKey: null }

// Makes the request.
armory._get = function(path, options, callback) {
  options.headers = options.headers || {}
  options.jar = false
  options.json = true

  path = '/api/wow' + path

  if (options.locale) { options.query.push('locale=' + options.locale) }
  if (!options.region) { throw new Error('region must be provided') }

  options.query = options.query.length ? '?' + options.query.join('&') : ''

  options.uri = 'http://' + options.region + '.battle.net' + path
  options.uri = encodeURI(options.uri + options.query)

  // Authentication
  if (this.privateKey && this.publicKey) {
    var signature = crypto.createHmac('sha1', this.privateKey)

    signature.update(['GET', new Date().toUTCString(), path].join('\n') + '\n')

    options.headers['Authorization'] = 'BNET ' + this.publicKey + ':' +
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

  options.query = buildQuery(['asc', 'page', 'size'], options)

  if (callback) {
    var cb = function(err, body, res) {
      var data = getKey(body, 'arenateam')
      callback.call(this, err, data, res)
    }
  }

  return this._get(path, options, cb)
}

// Retrieves object describing a battle pet.
armory.battlePetStats = function(options, callback) {
  var path = '/battlePet/stats/' + options.id

  options.query = buildQuery(['breedId', 'level', 'qualityId'], options)

  return this._get(path, options, callback)
}

// Retrieves array of auction data file URLs
armory.auction = function(options, callback) {
  var path = '/auction/data/' + options.name

  this._get(path, options, function(err, res) {
    if (err || !res) {
      return callback(err)
    }

    callback(null, res.files)
  })
}


// Returns new instance of module with default options applied to each method
armory.defaults = function(defaults) {
  defaults.name = defaults.name || defaults.id
  delete defaults.id

  var wrapper = function(fn) {
    return initParams(function(options, callback) {

      for (var prop in defaults) {
        if (options[prop] === undefined) {
          options[prop] = defaults[prop]
        }
      }

      fn(options, callback)
    })
  }

  return wrap(this, wrapper, this)
}


// Retrieves object describing an item with an optional fallback to Wowhead
armory.item = function(options, callback) {
  var path = '/item/' + options.name

  this._get(path, options, function(err, res) {
    if (err && wowhead && options.fallback !== false) {
      return wowhead(options.name, callback)
    }

    callback(err, res)
  })
}

// Retrieves an array of rated battleground ladder information.
armory.rbgLadder = function(options, callback) {
  var path = '/pvp/ratedbg/ladder'

  options.query = buildQuery(['asc', 'page', 'size'], options)

  if (callback) {
    var cb = function(err, body, res) {
      var data = getKey(body, 'bgRecord')
      callback.call(this, err, data, res)
    }
  }

  return this._get(path, options, cb)
}

// Retrieves array of realm objects with status info
armory.realmStatus = function(options, callback) {
  var path = '/realm/status'

  // Multiple realms
  if (Array.isArray(options.name)) {
    options.name = options.name.join('&realm=')
  }

  // Single realm or joined realms
  if (options.name) {
    options.query.push('realm=' + options.name)
  }

  this._get(path, options, function(err, res) {
    if (err) {
      return callback(err)
    }

    callback(null, res.realms)
  })
}


// Retrieves an object describing a character or guild.
;['character', 'guild'].forEach(function(method) {
  armory[method] = function(options, callback) {
    if (Array.isArray(options.fields)) {
      options.query.push('fields=' + options.fields.join())
    }

    if (options.lastModified) {
      options.headers['If-Modified-Since'] = new Date(options.lastModified)
        .toUTCString()
    }

    var path = '/' + [method, options.realm, options.id].join('/')
    return this._get(path, options, callback)
  }
})


// Export quest and recipe API
;['quest', 'recipe'].forEach(function(method) {
  armory[method] = function(options, callback) {
    var path = '/' + method + '/' + options.name
    this._get(path, options, callback)
  }
})


// Export static data API
;['battlegroups'
, 'characterAchievements'
, 'classes'
, 'guildAchievements'
, 'perks'
, 'races'
, 'rewards'

].forEach(function(method) {
  var property = method
    , path

  switch (method) {
    case 'perks':
    case 'rewards':
      path = 'guild/' + method
      break
    case 'classes':
    case 'races':
      path = 'character/' + method
      break
    case 'characterAchievements':
    case 'guildAchievements':
      property = 'achievements'
      path = method.replace('A', '/a')
      break
    default:
      path = method
  }

  path = '/data/' + path + '/'

  armory[method] = function(options, callback) {
    this._get(path, options, function(err, res) {
      if (err) {
        return callback(err)
      }

      callback(null, res[property])
    })
  }
})

// Returns array of query-string parameters from options.
function buildQuery(params, options) {
  return params.map(function(param) {
    if (options[param] != null) {
      return param + '=' + options[param]
    }
  })
}

// Returns the value of an object's key if it exists.
function getKey(obj, key) {
  if (obj && obj[key] != null) {
    return obj[key]
  } else {
    return obj
  }
}

// Returns a new instance of the module with a wrapper applied.
function wrap(target, wrapper, context) {
  var wrapped = {
    privateKey: target.privateKey
  , publicKey: target.publicKey
  , defaults: target.defaults
  , _get: target._get
  }

  for (var prop in target) {
    if (wrapped[prop] === undefined) {
      wrapped[prop] = wrapper(target[prop], context)
    }
  }

  return wrapped
}

function initParams(fn, context) {
  return function(options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}

    } else if (typeof options !== 'object' || Array.isArray(options)) {
      options = { name: options }
    } else {
      options.name = options.name || options.id
    }

    options.query = []
    fn.call(context, options, callback)
  }
}

module.exports = wrap(armory, initParams, armory)
