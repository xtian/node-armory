var request = require('request');

// Makes request
function api(options, callback) {

    var uri = 'http://' + options.region + '.battle.net/api/wow/' +
                options.path + '?' + options.query;

    request({ uri: uri }, function(err, res, body) {
        if (err) throw err;
        callback(body);
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
        options.region = 'us';
    }

    if (Array.isArray(realms)) {

        for (var i = realms.length; i--;) {
            options.query += 'realm=' + escape(realms[i]) + '&';
        }

    } else if (typeof realms === 'function') {
        callback = realms;
        options.region = 'us';

    } else if (realms.length === 2) {
        options.region = realms;

    } else {
        options.query = 'realm=' + escape(realms);
    }


    api(options, function(response) {
        response = JSON.parse(response);

        if (!response.status) {
            response = response.realms;
        }

        callback(response);
    });

    return;
};
