var armory = require('../lib/armory');

module.exports = {

    'single guild': function(test) {
        armory.guild('The Gentlemens Club_Shadowmoon', function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.equal(res.name, 'The Gentlemens Club');
            test.done();
        });
    },

    'multiple guilds': function(test) {
        var guilds = [];

        test.expect(9);

        armory.guild({
            names: ['Superfly', 'Eternals', 'Horde Revelation_Nazgrel'],
            realm: 'Shadowmoon'
        }, function(err, res) {
            test.ifError(err);
            test.ok(res);

            guilds.push(res.name);

            if (guilds.length === 3) {
                test.notEqual(guilds.indexOf('Superfly'), -1);
                test.notEqual(guilds.indexOf('Eternals'), -1);
                test.notEqual(guilds.indexOf('Horde Revelation'), -1);
                test.done();
            }
        });
    },

    'non-existent guild': function(test) {
        armory.guild('foo_Shadowmoon', function(err, res) {
            test.ok(err);
            test.done();
        });
    },

    'empty options': function(test) {
        armory.guild({}, function(err, res) {
            test.ok(err);
            test.done();
        });
    }
};
