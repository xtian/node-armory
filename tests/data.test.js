var armory = require('../').defaults({ region: 'us' });

module.exports = {

    'region': function(test) {
        armory.races({ region: 'eu' }, function(err, races) {
            test.ifError(err);
            test.ok(Array.isArray(races));
            test.ok(races.length);
            test.done();
        });
    },

    'locale': function(test) {
        armory.races({ locale: 'es_MX' }, function(err, races) {
            test.ifError(err);
            test.ok(Array.isArray(races));
            test.ok(races.length);
            test.equal(races[0].name, 'Humano');
            test.done();
        });
    },

    'region and locale': function(test) {
        armory.races({ region: 'eu', locale: 'de_DE' }, function(err, races) {
            test.ifError(err);
            test.ok(Array.isArray(races));
            test.ok(races.length);
            test.equal(races[1].name, 'Mensch');
            test.done();
        });
    },

    'battlegroups': function(test) {
        armory.battlegroups(function(err, results) {
           test.ifError(err);
           test.ok(Array.isArray(results));
           test.ok(results.length);
           test.done();
        });
    },

    'characterAcheivements': function(test) {
        armory.characterAchievements(function(err, results) {
           test.ifError(err);
           test.ok(Array.isArray(results));
           test.ok(results.length);
           test.done();
        });
    }
};
