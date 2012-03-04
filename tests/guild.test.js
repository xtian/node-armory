var test = require('tap').test,
    armory = require('../').defaults({
        region: 'us',
        realm: 'Shadowmoon',
        name: 'The Gentlemens Club'
    });

test('single guild', function(test) {
    armory.guild(function(err, guild) {
        test.error(err);
        test.ok(guild);
        test.equal(guild.name, 'The Gentlemens Club');
        test.end();
    });
});

test('additional fields', function(test) {
    armory.guild({ fields: ['members', 'achievements'] }, function(err, guild) {
        test.error(err);
        test.ok(guild);
        test.ok(Array.isArray(guild.members));
        test.ok(guild.members.length);
        test.ok(guild.achievements);
        test.ok(Array.isArray(guild.achievements.criteria));
        test.ok(guild.achievements.criteria.length);
        test.end();
    });
});

test('lastModified', function(test) {
    armory.guild(function(err, guild) {
        test.error(err);
        test.ok(guild);
        test.ok(guild.lastModified);

        armory.guild({
            lastModified: guild.lastModified

        }, function(err, guild) {
            test.error(err);
            test.equal(guild, undefined);
            test.end();
        });
    });
});

test('non-existent guild', function(test) {
    armory.guild('foo', function(err, guild) {
        test.ok(err);
        test.end();
    });
});

test('empty options', function(test) {
    require('../').guild({}, function(err, guild) {
        test.ok(err);
        test.end();
    });
});
