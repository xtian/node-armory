# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's [REST API for World of Warcraft](http://blizzard.github.com/api-wow-docs/).

## Installation

    npm install armory

## Documentation

[WoW API Documenation](http://blizzard.github.com/api-wow-docs)

All methods take an options object and callback as arguments.

If a string or number is passed instead of an options object, that value will be used as `options.id`. The rest of a method's required options can be provided using the `defaults` method.

If no callback is provided, a Stream will be returned.

Except for the static APIs, all options objects can have the following properties:

* `name`|`id`
* `region`
* `locale` _(optional)_

Note: `name` and `id` are interchangeable, and `locale` does not affect all API methods.

***
### arena(options, callback)
Retrieves an object containing data about an arena team.

Additional options:

* `realm`
* `size`

### arenaLadder(options, callback)
Retrieves an array of arena ladder information.

    armory.arenaLadder({
      region: 'us'
    , battlegroup: 'vindication'
    , id: '2v2'
    }, function(err, teams) {
        ...
    })

Additional options:

* `asc`
* `battlegroup`
* `page`
* `size`

### rbgLadder(options, callback)
Retrieves an array of rated battleground ladder information.

Additional options:

* `asc`
* `page`
* `size`

***
### battlePetStats(options, callback)
Retrieves object describing a battle pet.

Additional options:

* `breedId`
* `level`
* `qualityId`

***
### challenge(options, callback)
Retrieves an array of challenge mode leaderboard information for a realm.

### challengeRegion(options, callback)
Retrieves an array of challenge mode leaderboard information for a region.

Note: `challengeRegion` does not take an `id` option.

    armory.challengeRegion({ region: 'us' }, function(err, res) { ... })

***
### character(options, callback)
Retrieves an object containing data about a character.
### guild(options, callback)
Retrieves an object containing data about a guild.

Additional options:

* `fields` _(optional)_: must be an array
* `lastModified` _(optional)_: Date or timestamp to use for If-Modified-Since header
* `realm`

***
### defaults(options)
Returns a new instance of the module where all options will default to the provided values. If the first argument of a method is a number or string, it will be used as the `id`|`name` option.

    var armory = require('armory').defaults({
      name: 'Dargonaut'
    , realm: 'Shadowmoon'
    , region: 'us'
    })

    armory.character(function(err, character) { ... })
    armory.character('Dewbaca', function(err, character) { ... })

    armory.character({
      name: 'Talent'
    , realm: 'Lightbringer'

    }, function(err, character) { ... });

***
### achievement(options, callback)
Retrieves an object containing data about an achievement.
### auction(options, callback)
Retrieves an array of auction data URLs.
### battlePetSpecies(options, callback)
Retrieves an object containing data about a battle pet species.
### battlePetAbility(options, callback)
Retrieves an object containing data about a battle pet ability.
### item(options, callback)
Retrieves an object containing data about an item.
### itemSet(options, callback)
Retrieves an object containing data about an item set.
### quest(options, callback)
Retrieves an object containing data about a quest.
### recipe(options, callback)
Retrieves an object containing data about a recipe.
### spell(options, callback)
Retrieves an object containing data about a spell.

***
### realmStatus(options, callback)
Retrieves an array containing the status of one or more realms.

    armory.realmStatus({ region: 'us' }, function(err, realms) { ... );

A single realm name or an array of realm names can be passed. If no names are provided, the status of all realms will be returned.

***
### battlegroups(options, callback)
Retrieves a static array of all battlegroup names.
### characterAchievements(options, callback)
Retrieves a static array of all character achievements.
### classes(options, callback)
Retrieves a static array of data about character classes.
### guildAchievements(options, callback)
Retrieves a static array of all guild achievements.
### perks(options, callback)
Retrieves a static array of data about guild perks.
### races(options, callback)
Retrieves a static array of data about character races.
### rewards(options, callback)
Retrieves a static array of data about guild rewards.

Note: `id` and `name` are not used by these methods.

***
### Properties
#### auth.publicKey, auth.privateKey
Keys to use for generating an authorization header.

    var armory = require('armory')

    armory.auth.publicKey = 'foo'
    armory.auth.privateKey = 'bar'

    armory.realmStatus(function() { ... })

### Notes on usage:

* If an error occurs (including API errors), it will be passed as an Error object to the first parameter of the callback with its message in the `message` property. Otherwise, the parsed response body will passed as the second parameter and the full response will be passed as the third parameter.
* `lastModified` must be a `Date` instance or a string recognized by `Date.parse()`. If the requested resource has not been modified since the time of `lastModifed`, the callback will be invoked with the first two parameters empty.
