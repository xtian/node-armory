var test = require('tap').test
  , armory = require('../')

test('should merge options with defaults', function(t) {
  armory.realmStatus = function(options) {
    t.equal(options.region, 'us')
    t.equal(options.id, 0)
    t.end()
  }

  armory.defaults({region: 'us'}).realmStatus({id: 0}, function() {})
})

test('should merge id param with defaults', function(t) {
  armory.realmStatus = function(options) {
    t.equal(options.region, 'us')
    t.equal(options.id, 0)
    t.end()
  }

  armory.defaults({region: 'us'}).realmStatus(0, function() {})
})
