var test = require('tap').test
  , armory = require('../')

var Stream = require('stream').Stream

test('battlePetAbility', function(t) {
  var options = { id: 222, region: 'us' }

  t.test('should build correct url and response', function(t) {
    armory.battlePetAbility(options, function(err, body, res) {
      t.notOk(err, 'no error returned')
      t.equal(res.req.path, '/api/wow/battlePet/ability/222', 'built api url')
      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, 'object', 'returned an object')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.battlePetAbility(options)

    t.type(res, Stream)
    t.end()
  })
})

test('battlePetSpecies', function(t) {
  var options = { id: 444, region: 'us' }

  t.test('should build correct url and response', function(t) {
    armory.battlePetSpecies(options, function(err, body, res) {
      t.notOk(err, 'no error returned')
      t.equal(res.req.path, '/api/wow/battlePet/species/444', 'built api url')
      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, 'object', 'returned an object')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.battlePetSpecies(options)

    t.type(res, Stream)
    t.end()
  })
})

test('battlePetStats', function(t) {
  var options =
  { id: 258
  , breedId: 5
  , level: 25
  , qualityId: 4
  , region: 'us'
  }

  t.test('should build correct url and response', function(t) {
    armory.battlePetStats(options, function(err, body, res) {
      t.notOk(err, 'no error returned')

      t.equal(
        res.req.path
      , '/api/wow/battlePet/stats/258?breedId=5&level=25&qualityId=4'
      , 'built api url'
      )

      t.equal(res.statusCode, 200, 'returned 200')
      t.type(body, 'object', 'returned an object')
      t.end()
    })
  })

  t.test('should return a Stream if no callback is passed', function(t) {
    var res = armory.battlePetStats(options)

    t.type(res, Stream)
    t.end()
  })
})
