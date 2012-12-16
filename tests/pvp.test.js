var test = require('tap').test
  , armory = require('../')

var Stream = require('stream').Stream

test('arena', function(t) {
  var options =
  { name: 'Staker cheated on his GF'
  , realm: 'shadowmoon'
  , region: 'us'
  , size: '5v5'
  }

  t.test('should build correct url and response', function(t) {
    armory.arena(options, function(err, body, res) {
      t.notOk(err, 'no error returned')

      t.equal(
        res.req.path
      , '/api/wow/arena/shadowmoon/5v5/Staker%20cheated%20on%20his%20GF'
      , 'built api url'
      )

      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, 'object', 'returned an object')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.arena(options)

    t.type(res, Stream)
    t.end()
  })
})

test('arenaLadder', function(t) {
  var options =
  { battlegroup: 'vindication'
  , id: '2v2'
  , region: 'us'
  , asc: false
  , page: 2
  , size: 10
  }

  t.test('should build correct url and response', function(t) {
    armory.arenaLadder(options, function(err, body, res) {
      t.notOk(err, 'no error returned')

      t.equal(
        res.req.path
      , '/api/wow/pvp/arena/vindication/2v2?asc=false&page=2&size=10'
      , 'built api url'
      )

      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, Array, 'returned an array')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.arenaLadder(options)

    t.type(res, Stream)
    t.end()
  })
})

test('rbgLadder', function(t) {
  var options =
  { region: 'us'
  , asc: false
  , page: 2
  , size: 10
  }

  t.test('should build correct url and response', function(t) {
    armory.rbgLadder(options, function(err, body, res) {
      t.notOk(err, 'no error returned')

      t.equal(
        res.req.path
      , '/api/wow/pvp/ratedbg/ladder?asc=false&page=2&size=10'
      , 'built api url'
      )

      t.equal(options._query.asc, false, 'asc query param set')
      t.equal(options._query.page, 2, 'page query param set')
      t.equal(options._query.size, 10, 'size query param set')

      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, Array, 'returned an array')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.rbgLadder(options)

    t.type(res, Stream)
    t.end()
  })
})
