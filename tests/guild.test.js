var armory = require('../');

module.exports = {

    'single guild': function(test) {
        armory.guild('The Gentlemens Club_Shadowmoon', function(err, guild) {
            test.ifError(err);
            test.ok(guild);
            test.equal(guild.name, 'The Gentlemens Club');
            test.done();
        });
    },

    'additional fields': function(test) {
        armory.guild({
            names: 'The Gentlemens Club_Shadowmoon',
            fields: ['members', 'achievements']
        }, function(err, guild) {
            test.ifError(err);
            test.ok(guild);
            test.ok(Array.isArray(guild.members));
            test.ok(guild.members.length);
            test.ok(guild.achievements);
            test.ok(Array.isArray(guild.achievements.criteria));
            test.ok(guild.achievements.criteria.length);
            test.done();
        });
    },

    'lastModified': function(test) {
        var options = {
            names: 'The Gentlemens Club',
            realm: 'Shadowmoon'
        };

        armory.guild(options, function(err, guild) {
            test.ifError(err);
            test.ok(guild);
            test.ok(guild.lastModified);

            options.lastModified = guild.lastModified;

            armory.guild(options, function(err, guild) {
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
        }, function(err, guild) {
            test.ifError(err);
            test.ok(guild);

            guilds.push(guild.name);

            if (guilds.length === 3) {
                test.notEqual(guilds.indexOf('Superfly'), -1);
                test.notEqual(guilds.indexOf('Eternals'), -1);
                test.notEqual(guilds.indexOf('Horde Revelation'), -1);
                test.done();
            }
        });
    },

    'non-existent guild': function(test) {
        armory.guild('foo_Shadowmoon', function(err, guild) {
            test.ok(err);
            test.done();
        });
    },

    'empty options': function(test) {
        armory.guild({}, function(err, guild) {
            test.ok(err);
            test.done();
        });
    }
};
