var armory = require('../');

module.exports = {

    'single character': function(test) {
        armory.character('Dargonaut_Shadowmoon', function(err, character) {
            test.ifError(err);
            test.ok(character);
            test.equal(character.name, 'Dargonaut');
            test.done();
        });
    },

    'international name and server': function(test) {
        armory.character({
            names: 'Альвеона_Свежеватель Душ',
            region: 'eu'
        }, function(err, character) {
            test.ifError(err);
            test.ok(character);
            test.equal(character.name, 'Альвеона');
            test.done();
        });
    },

    'additional fields': function(test) {
        armory.character({
            names: 'Dargonaut_Shadowmoon',
            fields: ['items', 'talents']
        }, function(err, character) {
            test.ifError(err);
            test.ok(character);
            test.ok(character.items);
            test.ok(Array.isArray(character.talents));
            test.done();
        });
    },

    'additional fields with locale': function(test) {
        armory.character({
            names: 'Dargonaut_Shadowmoon',
            fields: ['titles'],
            locale: 'es_MX'
        }, function(err, character) {
            test.ifError(err);
            test.ok(character);
            test.ok(character.titles);
            test.equal(character.titles[0].name,
                '%s, Campeón de los baldíos helados');
            test.done();
        });
    },

    'region as parameter': function(test) {
        armory.character(
            'Альвеона_Свежеватель Душ',
            'eu',

            function(err, character) {
                test.ifError(err);
                test.ok(character);
                test.equal(character.name, 'Альвеона');
                test.done();
            }
        );
    },

    'locale as parameter': function(test) {
        armory.character('Dargonaut_Shadowmoon', 'es_MX', function(err, res) {
            test.ifError(err);
            test.ok(res);
            test.equal(res.name, 'Dargonaut');
            test.done();
        });
    },

    'region and locale as parameters': function(test) {
        armory.character(
            'Альвеона_Свежеватель Душ',
            'eu',
            'fr_FR',

            function(err, character) {
                test.ifError(err);
                test.ok(character);
                test.equal(character.name, 'Альвеона');
                test.done();
            }
        );
    },

    'lastModified': function(test) {
        var options = {
            names: 'Dargonaut',
            realm: 'Shadowmoon'
        };

        armory.character(options, function(err, character) {
            test.ifError(err);
            test.ok(character);
            test.ok(character.lastModified);

            options.lastModified = character.lastModified;

            armory.character(options, function(err, character) {
                test.ifError(err);
                test.equal(character, undefined);
                test.done();
            });
        });
    },

    'multiple characters': function(test) {
        var chars = [];

        test.expect(9);

        armory.character({
            names: ['Dargonaut', 'Dewbaca', 'Therago_Nazgrel'],
            realm: 'Shadowmoon'
        }, function(err, character) {
            test.ifError(err);
            test.ok(character);

            chars.push(character.name + '_' + character.realm);

            if (chars.length === 3) {
                test.notEqual(chars.indexOf('Dargonaut_Shadowmoon'), -1);
                test.notEqual(chars.indexOf('Dewbaca_Shadowmoon'), -1);
                test.notEqual(chars.indexOf('Therago_Nazgrel'), -1);

                test.done();
            }
        });
    },

    'non-existent character': function(test) {
        armory.character('foo_Shadowmoon', function(err, character) {
            test.ok(err);
            test.done();
        });
    },

    'empty options': function(test) {
        armory.character({}, function(err, character) {
            test.ok(err);
            test.done();
        });
    }
};
