var assert = require('assert'),
    armory = require('../lib/armory');
    
    
module.exports = {
    
    'test: all US realms': function(test) {
        armory.realmStatus(function(res) {
           test.ok(Array.isArray(res));
           test.equal(res[0].slug, 'aegwynn');
           test.done();
        });
    },
    
    'test: all EU realms': function(test) {
        armory.realmStatus('eu', function(res) {
            test.ok(Array.isArray(res));
            test.equal(res[0].slug, 'aegwynn');
            test.done();
        });
    },
    
    'test: single US realm': function(test) {
        armory.realmStatus('Shadowmoon', function(res) {
            test.ok(Array.isArray(res));
            test.equal(res[0].slug, 'shadowmoon');
            test.done();
        });
    },
    
    'test: single EU realm': function(test) {
        armory.realmStatus('Earthen Ring', 'eu', function(res) {
            test.ok(Array.isArray(res));
            test.equal(res[0].slug, 'earthen-ring');
            test.done();
        });
    },
    
    'test: multiple US realms': function(test) {
        armory.realmStatus(['Earthen Ring', 'Shadowmoon'], function(res) {
            test.ok(Array.isArray(res));
            test.equal(res[0].slug, 'shadowmoon');
            test.equal(res[1].slug, 'earthen-ring');
            test.done();
        });
    },
    
    'test: multiple EU realms': function(test) {
        armory.realmStatus(['Earthen Ring', 'Tarren Mill'], 'eu', function(res) {
            test.ok(Array.isArray(res));
            test.equal(res[0].slug, 'tarren-mill');
            test.equal(res[1].slug, 'earthen-ring');
            test.done();
        });
    },
    
    'test: non-existent realm': function(test) {
        armory.realmStatus('foo', function(res) {
            test.equal(res.status, 'nok');
            test.equal(res.reason, 'Invalid realm list');
            test.done();
        });
    }   
};