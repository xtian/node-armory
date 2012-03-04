var test = require('tap').test,
    armory = require('../').defaults({ region: 'us', fallback: false });

test('single item', function(test) {
    armory.item(27987, function(err, item) {
        test.error(err);
        test.ok(item);
        test.equal(item.id, 27987);
        test.end();
    });
});

test('non-existent item', function(test) {
    armory.item(0, function(err, item) {
        test.ok(err);
        test.end();
    });
});

test('4.3 item', function(test) {
    armory.item({ id: 72829, fallback: true }, function(err, item) {
        test.error(err);
        test.ok(item);
        test.equal(item.id, 72829);
        test.end();
    });
});
