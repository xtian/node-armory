var test = require('tap').test,
    armory = require('../').defaults({ region: 'us' });

test('single realm', function(test) {
    armory.auction('Shadowmoon', function(err, urls) {
        test.error(err);
        test.ok(Array.isArray(urls));
        test.ok(urls.length);
        test.end();
    });
});

test('region', function(test) {
    armory.auction({
        name: 'Свежеватель Душ',
        region: 'eu'

    }, function(err, urls) {
        test.error(err);
        test.ok(Array.isArray(urls));
        test.ok(urls.length);
        test.end();
    });
});

test('lastModified', function(test) {
    armory.auction('Shadowmoon', function(err, urls) {
        test.error(err);
        test.ok(Array.isArray(urls));
        test.ok(urls[0].lastModified);

        var lastModified = urls[0].lastModified;

        armory.auction({
            name: 'Shadowmoon',
            lastModified: lastModified

        }, function(err, res) {
            test.error(err);
            test.equal(res, undefined);
            test.end();
        });
    });
});

test('single realm data', function(test) {
    armory.auctionData('Shadowmoon', function(err, res) {
        test.error(err);
        test.ok(res);
        test.ok(res.alliance);
        test.ok(res.horde);
        test.ok(res.neutral);
        test.end();
    });
});

test('data with region', function(test) {
    armory.auctionData({
        name: 'Tarren Mill',
        region: 'eu'

    }, function(err, res) {
        test.error(err);
        test.ok(res);
        test.ok(res.alliance);
        test.ok(res.horde);
        test.ok(res.neutral);
        test.end();
    });
});

test('data with lastModified', function(test) {
    armory.auction('Shadowmoon', function(err, urls) {
        test.error(err);
        test.ok(urls);
        test.ok(urls[0].lastModified);

        var lastModified = urls[0].lastModified;

        armory.auctionData({
            name: 'Shadowmoon',
            lastModified: lastModified

        }, function(err, res) {
            test.error(err);
            test.equal(res, undefined);
            test.end();
        });
    });
});

