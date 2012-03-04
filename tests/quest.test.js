var armory = require('../').defaults({ region: 'us' });

module.exports = {

    'single quest': function(test) {
        armory.quest(11546, function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'region': function(test) {
        armory.quest({ id: 11546, region: 'eu' }, function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'locale': function(test) {
        armory.quest({ id: 11546, locale: 'de_DE' }, function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'region and locale': function(test) {
        armory.quest({
            id: 11546,
            region: 'eu',
            locale: 'de_DE'

        }, function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'non-existent quest': function(test) {
        armory.quest(0, function(err, quest) {
            test.ok(err);
            test.done();
        });
    }
};
