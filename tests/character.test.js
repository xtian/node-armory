var test = require('tap').test,
    armory = require('../').defaults({
        region: 'us',
        realm: 'Shadowmoon',
        name: 'Dargonaut'
    });

test('single character', function(test) {
    armory.character(function(err, character) {
        test.error(err);
        test.ok(character);
        test.equal(character.name, 'Dargonaut');
        test.end();
    });
});

test('international name and server', function(test) {
    armory.character({
        name: 'Альвеона',
        realm: 'Свежеватель Душ',
        region: 'eu'

    }, function(err, character) {
        test.error(err);
        test.ok(character);
        test.equal(character.name, 'Альвеона');
        test.end();
    });
});

test('additional fields', function(test) {
    armory.character({ fields: ['items', 'talents'] }, function(err, res) {
        test.error(err);
        test.ok(res);
        test.ok(res.items);
        test.ok(Array.isArray(res.talents));
        test.end();
    });
});

test('additional fields with locale', function(test) {
    armory.character({
        fields: ['titles'],
        locale: 'es_MX'

    }, function(err, character) {
        test.error(err);
        test.ok(character);
        test.ok(character.titles);
        test.equal(character.titles[0].name,
            '%s, Campeón de los baldíos helados');
        test.end();
    });
});

test('lastModified', function(test) {
    armory.character(function(err, character) {
        test.error(err);
        test.ok(character);
        test.ok(character.lastModified);

        armory.character({
            lastModified: character.lastModified

        }, function(err, character) {
            test.error(err);
            test.equal(character, undefined);
            test.end();
        });
    });
});

test('non-existent character', function(test) {
    armory.character('foo', function(err, character) {
        test.ok(err);
        test.end();
    });
});

test('empty options', function(test) {
    require('../').character({}, function(err, character) {
        test.ok(err);
        test.end();
    });
});
