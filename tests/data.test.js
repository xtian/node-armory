var test = require('tap').test
  , armory = require('../')

var Stream = require('stream').Stream

var options = { region: 'us' }

;['battlegroups'
, 'characterAchievements'
, 'classes'
, 'guildAchievements'
, 'perks'
, 'races'
, 'rewards'
].forEach(function(method) {

  test(method + ' should build correct url and output', function(t) {
    armory[method](options, function(err, body, res) {
      t.notOk(err, 'no error returned')
      t.type(body, Array, 'returned an array')
      t.equal(res.statusCode, 200, 'returned 200')
      t.end()
    })
  })

  test(method + ' should return Stream if no callback is passed', function(t) {
    var res = armory[method](options)

    t.type(res, Stream, 'returned a Stream')
    t.end()
  })
})
