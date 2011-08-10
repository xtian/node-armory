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
        armory.item(0, function(err, item) {
            test.ok(err);
            test.done();
        });
    }
};
