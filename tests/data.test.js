var test = require('tap').test,
    armory = require('../').defaults({ region: 'us' });

test('region', function(test) {
    armory.races({ region: 'eu' }, function(err, races) {
        test.error(err);
        test.ok(Array.isArray(races));
        test.ok(races.length);
        test.end();
    });
});

test('locale', function(test) {
    armory.races({ locale: 'es_MX' }, function(err, races) {
        test.error(err);
        test.ok(Array.isArray(races));
        test.ok(races.length);
        test.equal(races[0].name, 'Humano');
        test.end();
    });
});

test('region and locale', function(test) {
    armory.races({ region: 'eu', locale: 'de_DE' }, function(err, races) {
        test.error(err);
        test.ok(Array.isArray(races));
        test.ok(races.length);
        test.equal(races[1].name, 'Mensch');
        test.end();
    });
});

test('battlegroups', function(test) {
    armory.battlegroups(function(err, results) {
       test.error(err);
       test.ok(Array.isArray(results));
       test.ok(results.length);
       test.end();
    });
});

test('characterAcheivements', function(test) {
    armory.characterAchievements(function(err, results) {
       test.error(err);
       test.ok(Array.isArray(results));
       test.ok(results.length);
       test.end();
    });
});
