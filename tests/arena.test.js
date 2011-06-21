var armory = require('../lib/armory');

module.exports = {

    'single team': function(test) {
        armory.arena('IM ON A CAMEL_2v2_Shadowmoon', function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.equal(res.name, 'IM ON A CAMEL');
            test.done();
        });
    },

    'multiple teams': function(test) {
        var teams = [];

        test.expect(9);

        armory.arena({
            names: ['fasdfasdf', 'Africa_3v3', 'umad_3v3_Earthen Ring'],
            realm: 'Shadowmoon',
            size: '2v2'
        }, function(err, res) {
            test.ifError(err);
            test.ok(res);

            teams.push(res.name);

            if (teams.length === 3) {
                test.notEqual(teams.indexOf('fasdfasdf'), -1);
                test.notEqual(teams.indexOf('Africa'), -1);
                test.notEqual(teams.indexOf('umad'), -1);
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
