var armory = require('../').defaults({
    region: 'us',
    realm: 'Shadowmoon',
    name: 'The Gentlemens Club'
});

module.exports = {

    'single guild': function(test) {
        armory.guild(function(err, guild) {
            test.ifError(err);
            test.ok(guild);
            test.equal(guild.name, 'The Gentlemens Club');
            test.done();
        });
    },

    'additional fields': function(test) {
        armory.guild({
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
        armory.guild(function(err, guild) {
            test.ifError(err);
            test.ok(guild);
            test.ok(guild.lastModified);

            armory.guild({
                lastModified: guild.lastModified

            }, function(err, guild) {
                test.ifError(err);
                test.equal(guild, undefined);
                test.done();
            });
        });
    },

    'non-existent guild': function(test) {
        armory.guild('foo', function(err, guild) {
            test.ok(err);
            test.done();
        });
    },

    'empty options': function(test) {
        require('../').guild({}, function(err, guild) {
            test.ok(err);
            test.done();
        });
    }
};
