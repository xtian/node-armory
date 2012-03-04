var armory = require('../').defaults({ region: 'us' });

module.exports = {

    'single item': function(test) {
        armory.item(27987, function(err, item) {
            test.ifError(err);
            test.ok(item);
            test.equal(item.id, 27987);
            test.done();
        });
    },

    'non-existent item': function(test) {
        armory.item(0, function(err, item) {
            test.ok(err);
            test.done();
        });
    }
};
