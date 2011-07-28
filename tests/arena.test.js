var armory = require('../lib/armory');

module.exports = {

    'single team': function(test) {
        armory.arena('We bug you_3v3_Shadowmoon', function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.equal(res.name, 'We bug you');
            test.done();
        });
    },

    'multiple teams': function(test) {
        var teams = [];

        test.expect(6);

        armory.arena({
            names: ['Staker cheated on his GF', 'We bug you_3v3'],
            realm: 'Shadowmoon',
            size: '5v5'
        }, function(err, res) {
            test.ifError(err);
            test.ok(res);

            teams.push(res.name);

            if (teams.length === 2) {
                test.notEqual(teams.indexOf('Staker cheated on his GF'), -1);
                test.notEqual(teams.indexOf('We bug you'), -1);
                test.done();
            }
        });
    },

    'non-existent team': function(test) {
        armory.arena('foo_2v2_Shadowmoon', function(err, res) {
            test.ok(err);
            test.done();
        });
    },

    'empty options': function(test) {
        armory.arena({}, function(err, res) {
            test.ok(err);
            test.done();
        });
    }
};
