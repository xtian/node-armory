var request = require('request');

exports.defaultregion = 'us';

// Makes request
function api(options, callback) {

    var uri = 'http://' + options.region + '.battle.net/api/wow/' +
                options.path + '?' + options.query;

    request({ uri: uri, headers: { 'Connection': 'keep-alive' } }, function(err, res, body) {
        callback(err, body);
    });

    return;
}

// Provides realm status information
// Takes in optional realm(s) and region with callback. Returns parsed JSON.
exports.realmStatus = function(realms, region, callback) {

    var options = {
        path: 'realm/status',
        query: '',
        region: region
    };

    if (typeof region === 'function') {
        callback = region;
        options.region = this.defaultregion;
    }

    if (Array.isArray(realms)) {

        for (var i = realms.length; i--;) {
            options.query += 'realm=' + escape(realms[i]) + '&';
        }

    } else if (typeof realms === 'function') {
        callback = realms;
        options.region = this.defaultregion;

    } else if (realms.length === 2) {
        options.region = realms;

    } else {
        options.query = 'realm=' + escape(realms);
    }


    api(options, function(err, response) {
        if (err) {
            return callback(err);
        }
        
        try {
            response = JSON.parse(response);
        } catch (e) {
            return callback(e);
        }

        if (!response.status) {
            response = response.realms;
        } else {
            return callback(new Error(response.reason));
        }

        callback(null, response);
    });

    return;
};
