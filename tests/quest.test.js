var armory = require('../');

module.exports = {

    'single quest': function(test) {
        armory.quest(11546, function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'multiple quests': function(test) {
        var quests = [];

        test.expect(9);

        armory.quest([11547, 11533, 11525], function(err, quest) {
            test.ifError(err);
            test.ok(quest);

            quests.push(quest.id);

            if (quests.length === 3) {
                test.notEqual(quests.indexOf(11547), -1);
                test.notEqual(quests.indexOf(11533), -1);
                test.notEqual(quests.indexOf(11525), -1);
                test.done();
            }
        });
    },

    'region': function(test) {
        armory.quest(11546, 'eu', function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'locale': function(test) {
        armory.quest(11546, 'de_DE', function(err, quest) {
            test.ifError(err);
            test.ok(quest);
            test.equal(quest.id, 11546);
            test.done();
        });
    },

    'region and locale': function(test) {
        armory.quest(11546, 'eu', 'de_DE', function(err, quest) {
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
