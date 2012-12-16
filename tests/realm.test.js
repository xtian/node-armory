var test = require('tap').test
  , armory = require('../')

var Stream = require('stream').Stream

test('realmStatus', function(t) {
  var options = { id: 'shadowmoon', region: 'us' }

  t.test('should build correct url and response', function(t) {
    armory.realmStatus(options, function(err, body, res) {
      t.notOk(err, 'no error returned')

      t.equal(
        res.req.path
      , '/api/wow/realm/status?realm=shadowmoon'
      , 'built api url'
      )

      t.equal(options._query.realm, 'shadowmoon', 'realm query param set')
      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, Array, 'returned an array')
      t.equal(body.length, 1, 'returned one realm')

      t.end()
    })
  })

  t.test('should accept array of realms', function(t) {
    var options = { id: ['shadowmoon', 'nazgrel'], region: 'us' }

    armory.realmStatus(options, function(err, body) {
      t.notOk(err, 'no error returned')

      t.similar(
        options._query.realm
      , ['shadowmoon', 'nazgrel']
      , 'realm query param set'
      )

      t.type(body, Array, 'returned an array')
      t.equal(body.length, 2, 'returned two realms')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.realmStatus(options)

    t.type(res, Stream)
    t.end()
  })
})
