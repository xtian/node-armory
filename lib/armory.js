var request = require('request'),
    crypto = require('crypto');

exports.defaultRegion = 'us';
exports.privateKey = null;
exports.publicKey = null;


// Makes request
function get(options, callback) {
    if (options.uri) {
        uri = options.uri;
    } else {
        // Default values
        options.region = options.region || exports.defaultRegion;
        options.game = options.game || 'wow';
        options.query = options.query.length ? '?' + options.query.join('&') : '';

        var path = '/api/' + options.game + options.path,

        uri = encodeURI('https://' + options.region + '.battle.net' +
            path + options.query);
    }

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

        body = JSON.parse(body);

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
        return callback(new Error('No name(s) provided.'));
    }

    options.query = [];


    if (Array.isArray(options.fields)) {
        options.query.push('fields=' + options.fields.join(','));
    }

    if (options.locale) {
        options.query.push('locale=' + options.locale);
    }

    options.path = [method, options.realm, options.size];


    var parse = function(name) {
        var parseOptions = {
            path: options.path.slice(0),
            query: options.query.slice(0),
            region: options.region
        };

        // If path elements passed with name
        if (name.indexOf('_') !== -1) {
            name = name.split('_').reverse();

            // Name
            parseOptions.path.push(name.pop());

            // Realm
            if (name[0] && name[0].length > 3) {
                parseOptions.path[1] = name.shift();
            }

            // Team size
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
        options = { path: '/realm/status', query: [] };

    // Multiple realms
    if (Array.isArray(args[0])) {
        args[0] = args[0].join('&realm=');
    }

    // Single realm or joined multiple realms
    if (args[0] && args[0].length > 2) {
        options.query.push('realm=' + args.shift());
    }

    // Region
    if (args[0] && args[0].length === 2) {
        options.region = args[0];
    }

    if (options.locale) {
        options.query.push('locale=' + options.locale);
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
        options = { path: '/data/item/', query: [] };

    // Region
    if (args[1] && args[1].length === 2) {
        options.region = args[1];
    }

    if (options.locale) {
        options.query.push('locale=' + options.locale);
    }

    var parse = function(id) {
        get({
            path: options.path + id,
            region: options.region,
            query: options.query.slice(0)
        }, callback);
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
            options = { path: path, query: [] };

        // Region
        if (args[0] && args[0].length === 2) {
            options.region = args.shift();
        }

        // Locale
        if (args[0]) {
            options.query.push('locale=' + args[0]);
        }

        get(options, function(err, res) {
            if (err) {
                return callback(err);
            }

            callback(null, res[method]);
        });
    };
});

exports.auction = function() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = { path: '/auction/data/', query: [] };

    // Region
    if (args[1] && args[1].length === 2) {
        options.region = args[1];
    }

    var parse = function(realm) {
        get({
            path: options.path + realm,
            region: options.region,
            query: options.query.slice(0)
        }, callback);
    };

    if (Array.isArray(args[0])) {
        args[0].forEach(parse);
    } else {
        parse(args[0]);
    }
};

exports.auctiondata = function() {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = {  };

    var parse = function(url) {
        if (typeof url === 'object' && url.url)
            url = url.url
        
        get({
            uri: url
        }, callback);
    };

    if (Array.isArray(args[0])) {
        args[0].forEach(parse);
    } else {
        parse(args[0]);
    }
};