var request = require('request');

exports.defaultRegion = 'us';
exports.key = null;


// Makes request
function get(options, callback) {

    options.region = options.region || exports.defaultRegion;
    options.query = options.query || '';

    if (exports.key) {
        options.query = 'app=' + exports.key + '&' + options.query;
    }

    var uri = encodeURI('http://' + options.region + '.battle.net/api/wow/' +
        options.path + '?' + options.query);

    request({
        uri: uri,
        headers: { 'Connection': 'keep-alive' }

    }, function(err, res, body) {
        if (err) {
            callback(err);
        }

        try {
            body = JSON.parse(body);
        } catch (e) {
            return callback(e);
        }

        if (body.status) {
            return callback(new Error(body.reason));
        }

        callback(null, body);
    });
}

// Requests one or more API resources
function resource(method, options, callback) {

    var names;

    callback = typeof callback === 'function' ? callback : function() {};

    if (typeof options === 'string') {
        names = options;
        options = {};
    } else if (options.names) {
        names = options.names;
    } else {
        return callback(new Error('No character name(s) provided'));
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

        if (name.indexOf('_') !== -1) {

            name = name.split('_').reverse();

            parseOptions.path.push(name.pop());

            if (name[0] && name[0].length > 3) {
                parseOptions.path[1] = name.shift();
            }

            if (name[0] && name[0].length === 3) {
                parseOptions.path[2] = name.shift();
            }

        } else {
            parseOptions.path.push(name);
        }

        parseOptions.path = parseOptions.path.filter(function(el) {
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

// Provides realm status information
exports.realmStatus = function() {

    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = { path: 'realm/status' };

    callback = typeof callback === 'function' ? callback : function() {};

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

// Exports resource API using generic function
['character', 'guild', 'arena'].forEach(function(method) {
    exports[method] = function(options, callback) {
        resource(method, options, callback);
    };
});
