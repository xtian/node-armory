var armory = require('../');

module.exports = {

    'single team': function(test) {
        armory.arena('No Dairy_2v2_Shadowmoon', function(err, team) {
            test.ifError(err);
            test.ok(team);
            test.equal(team.name, 'No Dairy');
            test.done();
        });
    },

    'multiple teams': function(test) {
        var teams = [];

        test.expect(6);

        armory.arena({
            names: ['Staker cheated on his GF', 'No Dairy_2v2'],
            realm: 'Shadowmoon',
            size: '5v5'
        }, function(err, team) {
            test.ifError(err);
            test.ok(team);

            teams.push(team.name);

            if (teams.length === 2) {
                test.notEqual(teams.indexOf('Staker cheated on his GF'), -1);
                test.notEqual(teams.indexOf('No Dairy'), -1);
                test.done();
            }
        });
    },

    'non-existent team': function(test) {
        armory.arena('foo_2v2_Shadowmoon', function(err, team) {
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
        armory.ladder('2v2', 'Vindication', function(err, ladder) {
            test.ifError(err);
            test.ok(Array.isArray(ladder));
            test.ok(ladder.length);
            test.done();
        });
    },

    'multiple ladders': function(test) {
        var ladders = [];

        test.expect(6);

        armory.ladder(['3v3', '5v5'], 'Vindication', function(err, ladder) {
            test.ifError(err);
            test.ok(Array.isArray(ladder));
            test.ok(ladder.length);

            ladders.push(ladder);

            if (ladders.length === 2) {
                test.done();
            }
        });
    },

    'non-existent ladder': function(test) {
        armory.ladder('foo', 'Vindication', function(err, ladder) {
            test.ok(err);
            test.done();
        });
    },

    'non-existent battlegroup': function(test) {
        armory.ladder('2v2', 'foo', function(err, ladder) {
            test.ok(err);
            test.done();
        });
    }
};
