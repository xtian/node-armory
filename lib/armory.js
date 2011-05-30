var request = require('request');

exports.defaultRegion = 'us';

// Makes request
function get(options, callback) {

    options.region = options.region || exports.defaultRegion;
    options.query = options.query || '';

    var uri = 'http://' + options.region + '.battle.net/api/wow/' +
        options.path + '?' + options.query;

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

// Provides realm status information
// Takes in optional realm(s) and region with callback. Returns parsed JSON.
exports.realmStatus = function() {

    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        options = { path: 'realm/status' };

    if (Array.isArray(args[0])) {
        args[0] = args[0].join('&realm=');
    }

    if (args[0] && args[0].length > 2) {
        options.query = 'realm=' + encodeURI(args.shift());
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
