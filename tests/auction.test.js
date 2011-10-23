var armory = require('../');

module.exports = {

    'single realm': function(test) {
        armory.auction('Shadowmoon', function(err, urls) {
            test.ifError(err);
            test.ok(Array.isArray(urls));
            test.ok(urls.length);
            test.done();
        });
    },

    'multiple realms': function(test) {
        var responses = [];

        test.expect(6);

        armory.auction(['Shadowmoon', 'Nazgrel'], function(err, urls) {
            test.ifError(err);
            test.ok(Array.isArray(urls));
            test.ok(urls.length);

            responses.push(urls);

            if (responses.length === 2) {
                test.done();
            }
        });
    },

    'region': function(test) {
        armory.auction('Свежеватель Душ', 'eu', function(err, urls) {
            test.ifError(err);
            test.ok(Array.isArray(urls));
            test.ok(urls.length);
            test.done();
        });
    },

    'lastModified': function(test) {
        armory.auction('Shadowmoon', function(err, urls) {
            test.ifError(err);
            test.ok(Array.isArray(urls));
            test.ok(urls[0].lastModified);

            var lastModified = urls[0].lastModified;

            armory.auction({
                names: 'Shadowmoon',
                lastModified: lastModified

            }, function(err, res) {
                test.ifError(err);
                test.equal(res, undefined);
                test.done();

            });
        });
    },

    'single realm data': function(test) {
        armory.auctionData('Shadowmoon', function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.ok(res.alliance);
            test.ok(res.horde);
            test.ok(res.neutral);
            test.done();
        });
    },

    'multiple realm data': function(test) {
        var realms = [];

        test.expect(6);

        armory.auctionData(['Shadowmoon', 'Nazgrel'], function(err, res) {
            test.ifError(err);
            test.ok(res);

            realms.push(res.realm.name);

            if (realms.length === 2) {
                test.notEqual(realms.indexOf('Shadowmoon'), -1);
                test.notEqual(realms.indexOf('Nazgrel'), -1);

                test.done();
            }
        });
    },

    'data with region': function(test) {
        armory.auctionData('Tarren Mill', 'eu', function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.ok(res.alliance);
            test.ok(res.horde);
            test.ok(res.neutral);
            test.done();
        });
    },

    'data with lastModified': function(test) {
        armory.auction('Shadowmoon', function(err, urls) {
            test.ifError(err);
            test.ok(urls);
            test.ok(urls[0].lastModified);

            var lastModified = urls[0].lastModified;

            armory.auctionData({
                names: 'Shadowmoon',
                lastModified: lastModified

            }, function(err, res) {
                test.ifError(err);
                test.equal(res, undefined);
                test.done();

            });
        });
    }
};
