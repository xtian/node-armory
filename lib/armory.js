var request = require('request'),
    crypto = require('crypto');

exports.defaultRegion = 'us';
exports.privateKey = null;
exports.publicKey = null;


// Makes request
function get(options, callback) {
    // Default values
    options.region = options.region || exports.defaultRegion;
    options.game = options.game || 'wow';
    options.query = options.query ? '?' + options.query : '';

    var path = '/api/' + options.game + options.path,

        uri = encodeURI('http://' + options.region + '.battle.net' +
            path + options.query),

        headers = { 'Connection': 'keep-alive' };

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
        if (err) {
            return callback(err);
        }

        try {
            body = JSON.parse(body);
        } catch (e) {
            return callback(e);
        }

        if (body.status === 'nok') {
            return callback(new Error(body.reason));
        }

        callback(null, body);
    });
}


// Requests one or more API resources
function resource(method, options, callback) {
    var names;

    // If single resource provided
    if (typeof options === 'string') {
        names = options;
        options = {};
    } else if (options.names) {
        names = options.names;
    } else {
        return callback(new Error('No character name(s) provided.'));
    }

    if (Array.isArray(options.fields)) {
        options.query = 'fields=' + options.fields.join(',');
    }

    options.path = [method, options.realm, options.size];

    var parse = function(name) {
        var parseOptions = {
            path: options.path.slice(0),
            query: options.query,
            region: options.region
        };

        // If path elements passed with name
        if (name.indexOf('_') !== -1) {
            name = name.split('_').reverse();

            parseOptions.path.push(name.pop());

            if (name[0] && name[0].length > 3) {
                parseOptions.path[1] = name.shift();
            }

            if (name[0] && name[0].length === 3) {
                parseOptions.path[2] = name.shift();
            }
        } else if (options.realm) {
            parseOptions.path.push(name);
        } else {
            return callback(new Error('No realm provided for ' + name + '.'));
        }

        // Remove empty path elements
        parseOptions.path = '/' + parseOptions.path.filter(function(el) {
            return !!el;
        }).join('/');

        get(parseOptions, callback);
    };

    if (Array.isArray(names)) {
        names.forEach(parse);
    } else {
        parse(names);
    }
}


// Realm Status API
exports.realmStatus = function() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = { path: '/realm/status' };

    if (Array.isArray(args[0])) {
        args[0] = args[0].join('&realm=');
    }

    if (args[0] && args[0].length > 2) {
        options.query = 'realm=' + args.shift();
    }

    if (args[0] && args[0].length === 2) {
        options.region = args[0];
    }

    get(options, function(err, response) {
        if (err) {
            return callback(err);
        }

        callback(null, response.realms);
    });
};


// Item API
exports.item = function() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = { path: '/data/item/' };

    if (args[1] && args[1].length === 2) {
        options.region = args[1];
    }

    var parse = function(id) {
        get({ path: options.path + id, region: options.region }, callback);
    };

    if (Array.isArray(args[0])) {
        args[0].forEach(parse);
    } else {
        parse(args[0]);
    }
};


// Exports resource API using generic function
['character', 'guild', 'arena'].forEach(function(method) {
    exports[method] = function(options, callback) {
        resource(method, options, callback);
    };
});


// Static data pages
['perks', 'rewards', 'classes', 'races'].forEach(function(method) {
    var path;

    // Add appropriate prefix
    switch (method) {
        case 'perks':
        case 'rewards':
            path = 'guild/' + method;
            break;
        case 'classes':
        case 'races':
            path = 'character/' + method;
            break;
    }

    path = '/data/' + path;

    exports[method] = function() {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            options = { path: path };

        if (args[0]) {
            options.region = args[0];
        }

        get(options, function(err, res) {
            if (err) {
                return callback(err);
            }

            callback(null, res[method]);
        });
    };
});
