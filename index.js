var request = require('request'),
    crypto = require('crypto');

exports.defaultRegion = 'us';
exports.privateKey = exports.publicKey = null;

// Makes request
function get(path, options, callback) {
    var headers = { 'Accept': 'application/json', 'Connection': 'keep-alive' },
        uri;

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }


    // Handle full URLs
    if (path.indexOf('http://') === 0) {
        uri = path;
        path = uri.split('battle.net')[1];

    } else {
        options.region = options.region || exports.defaultRegion;
        options.query = '?' + options.query.slice(0).join('&');

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
    if (exports.privateKey && exports.publicKey) {
        var signature = crypto.createHmac('sha1', exports.privateKey);

        signature.update(
            'GET\n' +
            new Date().toUTCString() + '\n' +
            path + '\n'
        );

        headers['Authorization'] = 'BNET ' + exports.publicKey + ':' +
            signature.digest('base64');
    }


    request({ uri: uri, headers: headers }, function(err, res, body) {
        if (err || !body) {

            if (res.statusCode !== 304) {
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
}


function clone(obj) {
    var ret = {};

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            ret[prop] = obj[prop];
        }
    }

    return ret;
}


// Parse arguments into an options object
function parseArgs(args) {
    args = Array.prototype.slice.call(args);

    var callback = args.pop(),
        options;

    // Return object if given
    if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
        options = args[0];

        options.names = options.names || options.ids || '';
        options.callback = callback;
        options.query = [];

    } else {
        options = {
            names: args.shift(),
            callback: callback,
            query: []
        };

        // Region
        if (args[0] && args[0].length === 2) {
            options.region = args.shift();
        }

        // Locale
        if (args[0]) {
            options.locale = args[0];
        }
    }


    if (options.locale) {
        options.query.push('locale=' + options.locale);
    }

    return options;
}


// Requests one or more API resources in the form "/method/realm/name"
function resource(method, args) {
    var options = parseArgs(args),
        callback = options.callback,
        path = [method, options.realm, options.size];


    if (Array.isArray(options.fields)) {
        options.query.push('fields=' + options.fields.join(','));
    }


    var parse = function(name) {
        var parseOptions = clone(options),
            parsePath = path.slice(0);

        // If path elements passed with name
        if (name.indexOf('_') !== -1) {

            name = name.split('_').reverse();

            // Name
            parsePath.push(name.pop());

            // Realm
            if (name[0] && name[0].length > 3) {
                parsePath[1] = name.shift();
            }

            // Team size
            if (name[0]) {
                parsePath[2] = name[0];
            }

        } else if (options.realm) {
            parsePath.push(name);

        } else {
            return callback(new Error('No realm provided for ' + name + '.'));
        }

        // Remove empty parsePath elements
        parsePath = '/' + parsePath.filter(function(el) {
            return !!el;
        }).join('/');

        get(parsePath, parseOptions, callback);
    };


    if (Array.isArray(options.names)) {
        options.names.forEach(parse);
    } else {
        parse(options.names);
    }
}


// Returns array of auction data file URLs
exports.auction = function() {
    var options = parseArgs(arguments),
        callback = options.callback,
        path = '/auction/data/';

    delete options.callback;

    var parse = function(realm) {
        var parseOptions = clone(options);

        get(path + realm, parseOptions, function(err, res) {
            if (err || !res) {
                return callback(err);
            }

            callback(null, res.files);
        });
    };


    if (Array.isArray(options.names)) {
        options.names.forEach(parse);
    } else {
        parse(options.names);
    }
};


// Returns auction data dump from first file URL
exports.auctionData = function() {
    var options = parseArgs(arguments),
        callback = options.callback;

    var getData = function(err, res) {
        if (err || !res) {
            return callback(err);
        }

        get(res[0].url, callback);
    };

    this.auction.call(this, options, getData);
};


// Returns array of realm objects with status info
exports.realmStatus = function() {
    // Can't use parseArgs because all params are optional
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = { query: [] },
        path = '/realm/status';

    // Multiple realms
    if (Array.isArray(args[0])) {
        args[0] = args[0].join('&realm=');
    }

    // Single realm or joined realms
    if (args[0] && args[0].length > 2) {
        options.query.push('realm=' + args.shift());
    }

    // Region
    if (args[0] && args[0].length === 2) {
        options.region = args.shift();
    }

    // Locale
    if (args[0]) {
        options.query.push('locale=' + args[0]);
    }

    get(path, options, function(err, res) {
        if (err) {
            return callback(err);
        }

        callback(null, res.realms);
    });
};


// Export resource API
['character', 'guild', 'arena'].forEach(function(method) {
    exports[method] = function() {
        resource(method, arguments);
    };
});


// Export quest and item API
['item', 'quest'].forEach(function(method) {

    exports[method] = function() {
        var options = parseArgs(arguments),
            callback = options.callback,
            path = '/' + method + '/';

        delete options.callback;

        var parse = function(name) {
            var parseOptions = clone(options);

            get(path + name, parseOptions, callback);
        };


        if (Array.isArray(options.names)) {
            options.names.forEach(parse);
        } else {
            parse(options.names);
        }
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
            path = method.replace('Ach', '/ach');
            break;
        default:
            path = method;
    }

    path = '/data/' + path + '/';

    exports[method] = function() {
        // Can't use parseArgs because all params are optional
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            options = { query: [] };

        // Region
        if (args[0] && args[0].length === 2) {
            options.region = args.shift();
        }

        // Locale
        if (args[0]) {
            options.query.push('locale=' + args[0]);
        }

        get(path, options, function(err, res) {
            if (err) {
                return callback(err);
            }

            callback(null, res[property]);
        });
    };
});
