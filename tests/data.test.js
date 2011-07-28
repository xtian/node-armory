var armory = require('../lib/armory');

module.exports = {

    'single item': function(test) {
        armory.item(27987, function(err, item) {
            test.ifError(err);
            test.ok(item);
            test.equal(item.id, 27987);
            test.done();
        });
    },

    'multiple items': function(test) {
        var items = [];

        test.expect(9);

        armory.item([28275, 27903, 28041], function(err, item) {
            test.ifError(err);
            test.ok(item);

            items.push(item.id);

            if (items.length === 3) {
                test.notEqual(items.indexOf(28275), -1);
                test.notEqual(items.indexOf(27903), -1);
                test.notEqual(items.indexOf(28041), -1);
                test.done();
            }
        });
    },

    'non-existent item': function(test) {
        armory.item(0, function(err, res) {
            test.ok(err);
            test.done();
        });
    },

    'perks': function(test) {
        armory.perks(function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.done();
        });
    },

    'rewards': function(test) {
        armory.rewards(function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.done();
        });
    },

    'classes': function(test) {
        armory.classes(function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.done();
        });
    },

    'races': function(test) {
        armory.races(function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.done();
        });
    },

    'region': function(test) {
        armory.races('eu', function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.done();
        });
    },

    'locale': function(test) {
        armory.races('es_MX', function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.equal(res[0].name, 'Enano');
            test.done();
        });
    },

    'region and locale': function(test) {
        armory.races('eu', 'de_DE', function(err, res) {
            test.ifError(err);
            test.ok(Array.isArray(res));
            test.ok(res.length);
            test.equal(res[1].name, 'Mensch');
            test.done();
        });
    }
};
