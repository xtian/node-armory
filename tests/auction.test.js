var armory = require('../').defaults({ region: 'us' });

module.exports = {

    'single realm': function(test) {
        armory.auction('Shadowmoon', function(err, urls) {
            test.ifError(err);
            test.ok(Array.isArray(urls));
            test.ok(urls.length);
            test.done();
        });
    },

    'region': function(test) {
        armory.auction(
            { name: 'Свежеватель Душ', region: 'eu' },
            function(err, urls) {
                test.ifError(err);
                test.ok(Array.isArray(urls));
                test.ok(urls.length);
                test.done();
            }
        );
    },

    'lastModified': function(test) {
        armory.auction('Shadowmoon', function(err, urls) {
            test.ifError(err);
            test.ok(Array.isArray(urls));
            test.ok(urls[0].lastModified);

            var lastModified = urls[0].lastModified;

            armory.auction({
                name: 'Shadowmoon',
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

    'data with region': function(test) {
        armory.auctionData({
            name: 'Tarren Mill',
            region: 'eu'

        }, function(err, res) {
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
                name: 'Shadowmoon',
                lastModified: lastModified

            }, function(err, res) {
                test.ifError(err);
                test.equal(res, undefined);
                test.done();
            });
        });
    }
};
