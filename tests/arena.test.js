var armory = require('../').defaults({
    region: 'us',
    battlegroup: 'Vindication',
    realm: 'Shadowmoon'
});

module.exports = {

    'single team': function(test) {
        armory.arena({ name: 'No Dairy', size: '2v2' }, function(err, team) {
            test.ifError(err);
            test.ok(team);
            test.equal(team.name, 'No Dairy');
            test.done();
        });
    },

    'non-existent team': function(test) {
        armory.arena({ name: 'foo', size: '2v2' }, function(err, team) {
            test.ok(err);
            test.done();
        });
    },

    'empty options': function(test) {
        armory.arena({}, function(err, team) {
            test.ok(err);
            test.done();
        });
    },

    'single ladder': function(test) {
        armory.ladder({ name: '2v2' }, function(err, ladder) {
            test.ifError(err);
            test.ok(Array.isArray(ladder));
            test.ok(ladder.length);
            test.done();
        });
    },

    'non-existent ladder': function(test) {
        armory.ladder({ name: 'foo' }, function(err, ladder) {
            test.ok(err);
            test.done();
        });
    },

    'non-existent battlegroup': function(test) {
        armory.ladder({
            name: '2v2',
            battlegroup: 'foo'

        }, function(err, ladder) {
            test.ok(err);
            test.done();
        });
    }
};
