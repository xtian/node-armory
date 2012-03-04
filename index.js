var request = require('request'),
    crypto = require('crypto');

try {
    var wowhead = require('wowhead');
} catch (e) {}

var armory = { privateKey: null, publicKey: null };


function initParams(fn, context) {
    return function(options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};

        } else if (typeof options !== 'object' || Array.isArray(options)) {
            options = { name: options };
        } else {
            options.name = options.name || options.id;
        }

        options.query = [];
        fn.call(context, options, callback);
    };
}


// Returns a new instance of the module with a wrapper applied.
function wrap(target, wrapper, context) {
    var wrapped = {
        privateKey: target.privateKey,
        publicKey: target.publicKey,
        defaults: target.defaults,
        _get: target._get
    };

    for (var prop in target) {
        if (wrapped[prop] === undefined) {
            wrapped[prop] = wrapper(target[prop], context);
        }
    }

    return wrapped;
}


// Makes request
armory._get = function(path, options, callback) {
    var headers = { 'Connection': 'keep-alive' },
        uri;

    // Handle full URLs
    if (path.indexOf('http://') === 0) {
        uri = path;
        path = uri.split('battle.net')[1];

    } else {
        if (options.locale) {
            options.query.push('locale=' + options.locale);
        }

        options.query = '?' + options.query.join('&');
        path = '/api/wow' + path;

        uri = encodeURI('http://' + options.region + '.battle.net' + path +
            options.query);
    }

    // Last-Modified
    if (options.lastModified) {
        headers['If-Modified-Since'] = new Date(options.lastModified)
            .toUTCString();
    }

    // Authentication
    if (this.privateKey && this.publicKey) {
        var signature = crypto.createHmac('sha1', this.privateKey);

        signature.update(
            'GET\n' +
            new Date().toUTCString() + '\n' +
            path + '\n'
        );

        headers['Authorization'] = 'BNET ' + this.publicKey + ':' +
            signature.digest('base64');
    }

    request({ uri: uri, headers: headers }, function(err, res, body) {
        if (err || !body) {

            if (res && res.statusCode !== 304) {
                err = err || new Error(res.statusCode);
            }

            return callback(err);
        }

        body = JSON.parse(body);

        if (body.status === 'nok') {
            return callback(new Error(body.reason));
        }

        callback(null, body);
    });
};


// Retrieves array of auction data file URLs
armory.auction = function(options, callback) {
    var path = '/auction/data/' + options.name;

    this._get(path, options, function(err, res) {
        if (err || !res) {
            return callback(err);
        }

        callback(null, res.files);
    });
};


// Retrieves auction data dump from first file URL
armory.auctionData = function(options, callback) {
    var self = this;

    var getData = function(err, res) {
        if (err || !res) {
            return callback(err);
        }

        self._get(res[0].url, {}, callback);
    };

    this.auction.call(this, options, getData);
};


// Returns new instance of module with default options applied to each method
armory.defaults = function(defaults) {
    defaults.name = defaults.name || defaults.id;
    delete defaults.id;

    var wrapper = function(fn) {
        return initParams(function(options, callback) {

            for (var prop in defaults) {
                if (options[prop] === undefined) {
                    options[prop] = defaults[prop];
                }
            }

            fn(options, callback);
        });
    };

    return wrap(this, wrapper, this);
};


// Retrieves object describing an item with an optional fallback to Wowhead
armory.item = function(options, callback) {
    var path = '/item/' + options.name;

    this._get(path, options, function(err, res) {
        if (err && wowhead && options.fallback !== false) {
            return wowhead(options.name, callback);
        }

        callback(err, res);
    });
};


// Retrieves array of objects describing the teams in a given arena ladder
armory.ladder = function(options, callback) {
    var path = '/pvp/arena/' + options.battlegroup + '/' + options.name;

    this._get(path, options, function(err, res) {
        if (err || !res) {
            return callback(err);
        }

        callback(null, res.arenateam);
    });
};


// Retrieves array of realm objects with status info
armory.realmStatus = function(options, callback) {
    var path = '/realm/status';

    // Multiple realms
    if (Array.isArray(options.name)) {
        options.name = options.name.join('&realm=');
    }

    // Single realm or joined realms
    if (options.name) {
        options.query.push('realm=' + options.name);
    }

    this._get(path, options, function(err, res) {
        if (err) {
            return callback(err);
        }

        callback(null, res.realms);
    });
};


// Retrieves an API resource in the form "/method/realm/name"
['arena', 'character', 'guild'].forEach(function(method) {
    armory[method] = function(options, callback) {
        if (Array.isArray(options.fields)) {
            options.query.push('fields=' + options.fields.join());
        }

        var path = '/' + [
            method,
            options.realm,
            options.size
        ].filter(function(el) {
            return !!el;

        }).join('/') + '/' + options.name;

        this._get(path, options, callback);
    };
});


// Export quest and recipe API
['quest', 'recipe'].forEach(function(method) {
    armory[method] = function(options, callback) {
        var path = '/' + method + '/' + options.name;
        this._get(path, options, callback);
    };
});


// Export static data API
[
    'battlegroups',
    'characterAchievements',
    'classes',
    'guildAchievements',
    'perks',
    'races',
    'rewards'

].forEach(function(method) {
    var property = method,
        path;

    switch (method) {
        case 'perks':
        case 'rewards':
            path = 'guild/' + method;
            break;
        case 'classes':
        case 'races':
            path = 'character/' + method;
            break;
        case 'characterAchievements':
        case 'guildAchievements':
            property = 'achievements';
            path = method.replace('A', '/a');
            break;
        default:
            path = method;
    }

    path = '/data/' + path + '/';

    armory[method] = function(options, callback) {
        this._get(path, options, function(err, res) {
            if (err) {
                return callback(err);
            }

            callback(null, res[property]);
        });
    };
});


module.exports = wrap(armory, initParams, armory);
