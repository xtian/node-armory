# node-armory

[![Build Status](https://travis-ci.org/xtian/node-armory.svg?branch=master)](https://travis-ci.org/xtian/node-armory)

A simple [node.js](https://github.com/nodejs/node) wrapper around Blizzard's [REST API for World of Warcraft](https://dev.battle.net/io-docs).

## Installation

    npm install armory

## Documentation

[WoW API Documenation](https://dev.battle.net/io-docs)

All methods take an options object and callback as arguments.

If no callback is provided, a Stream will be returned.

Except for the static APIs, all options objects can have the following properties:

* `apiKey`
* `name`|`id`
* `region`
* `locale` _(optional)_

Note: `name` and `id` are interchangeable, and `locale` does not affect all API methods.

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

```js
armory.challengeRegion({ region: 'us' }, function(err, res) { … })
```

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

```js
armory.realmStatus({ region: 'us' }, function(err, realms) { … })
```

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

### Notes on usage:

* If an error occurs (including API errors), it will be passed as an Error object to the first parameter of the callback with its message in the `message` property. Otherwise, the parsed response body will passed as the second parameter and the full response will be passed as the third parameter.
* `lastModified` must be a `Date` instance or a string recognized by `Date.parse()`. If the requested resource has not been modified since the time of `lastModifed`, the callback will be invoked with the first two parameters empty.
