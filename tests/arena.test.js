var test = require('tap').test,
    armory = require('../').defaults({
        region: 'us',
        battlegroup: 'Vindication',
        realm: 'Shadowmoon'
    });

test('single team', function(test) {
    armory.arena({ name: 'No Dairy', size: '2v2' }, function(err, team) {
        test.error(err);
        test.ok(team);
        test.equal(team.name, 'No Dairy');
        test.end();
    });
});

test('non-existent team', function(test) {
    armory.arena({ name: 'foo', size: '2v2' }, function(err, team) {
        test.ok(err);
        test.end();
    });
});

test('empty options', function(test) {
    armory.arena({}, function(err, team) {
        test.ok(err);
        test.end();
    });
});

test('single ladder', function(test) {
    armory.ladder({ name: '2v2' }, function(err, ladder) {
        test.error(err);
        test.ok(Array.isArray(ladder));
        test.ok(ladder.length);
        test.end();
    });
});

test('non-existent ladder', function(test) {
    armory.ladder({ name: 'foo' }, function(err, ladder) {
        test.ok(err);
        test.end();
    });
});

test('non-existent battlegroup', function(test) {
    armory.ladder({
        name: '2v2',
        battlegroup: 'foo'

    }, function(err, ladder) {
        test.ok(err);
        test.end();
    });
});
