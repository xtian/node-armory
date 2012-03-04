var test = require('tap').test,
    armory = require('../').defaults({ region: 'us' });

test('single quest', function(test) {
    armory.quest(11546, function(err, quest) {
        test.error(err);
        test.ok(quest);
        test.equal(quest.id, 11546);
        test.end();
    });
});

test('region', function(test) {
    armory.quest({ id: 11546, region: 'eu' }, function(err, quest) {
        test.error(err);
        test.ok(quest);
        test.equal(quest.id, 11546);
        test.end();
    });
});

test('locale', function(test) {
    armory.quest({ id: 11546, locale: 'de_DE' }, function(err, quest) {
        test.error(err);
        test.ok(quest);
        test.equal(quest.id, 11546);
        test.end();
    });
});

test('region and locale', function(test) {
    armory.quest({
        id: 11546,
        region: 'eu',
        locale: 'de_DE'

    }, function(err, quest) {
        test.error(err);
        test.ok(quest);
        test.equal(quest.id, 11546);
        test.end();
    });
});

test('non-existent quest', function(test) {
    armory.quest(0, function(err, quest) {
        test.ok(err);
        test.end();
    });
});
