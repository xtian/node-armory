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

    'request additional fields': function(test) {
        armory.guild({
            names: 'The Gentlemens Club_Shadowmoon',
            fields: ['members', 'achievements']
        }, function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.ok(Array.isArray(res.members));
            test.ok(res.members.length);
            test.ok(res.achievements);
            test.ok(Array.isArray(res.achievements.criteria));
            test.ok(res.achievements.criteria.length);
            test.done();
        });
    },

    'request guild with lastModified': function(test) {
        var options = {
            names: 'The Gentlemens Club',
            realm: 'Shadowmoon'
        };

        armory.guild(options, function(err, guild) {
            test.ifError(err);
            test.ok(res);
            test.ok(res.lastModified);

            options.lastModified = res.lastModified;

            armory(options, function(err, guild) {
                test.ifError(err);
                test.equal(guild, undefined);
                test.done();
            });
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
