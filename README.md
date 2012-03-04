# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's [REST API for World of Warcraft](http://blizzard.github.com/api-wow-docs/).

## Installation

    npm install armory
    npm install wowhead  # optional

If the [wowhead](http://github.com/xtian/node-wowhead) module is installed, it will be used as a fallback [when item requests fail](http://us.battle.net/wow/en/forum/topic/3657606329).


## Documentation


Except for the static APIs, all options objects can have the following properties:

* `name`|`id`
* `lastModified` _(optional)_
* `locale` _(optional)_
* `region`

Note: `name` and `id` are interchangeable, and `locale` and `lastModified` do not affect all API methods.

***
### auction(options, callback)
Retrieves an array of auction data URLs.

### auctionData(options, callback)
Retrieves an object of data from the first auction data URL provided by the API.

    armory.auctionData({ name: 'Shadowmoon', region: 'us' }, function(err, res) {

        var agiPots = res.alliance.auctions.filter(function(auction) {
            return auction.item === 58145;
        });
    });

[Auction API Documentation](http://blizzard.github.com/api-wow-docs/#id3381986)


***
### arena(options, callback)
Retrieves an object containing data about an arena team.

    armory.arena({
        name: 'No Dairy',
        size: '2v2',
        realm: 'Shadowmoon',
        region: 'us'

    }, function(err, team) {
        var ratio = team.gamesWon / team.gamesLost;
    });

Additional options:

* `realm`
* `size`

[Arena Team API Documentation](http://blizzard.github.com/api-wow-docs/#id3382144)

***
### character(options, callback)
Retrieves an object containing data about a character.
### guild(options, callback)
Retrieves an object containing data about a guild.

    var armory = require('armory').defaults({
        realm: 'Shadowmoon',
        region: 'us'
    });

    armory.guild({
        name: 'The Gentlemens Club',
        fields: ['members']

    }, function(err, guild) {

        var dwarvenHairColors = [];

        guild.members.filter(function(member) {
            return member.character.race === 3;

        }).map(function(member) {
            return member.character.name;

        }).forEach(function(dwarf) {
            armory.character({
                name: dwarf,
                fields: ['appearance']

            }, function(err, character) {
                hairColors.push(character.appearance.hairColor);
            });
        });
    });

Additional options:

* `fields` _(optional)_: must be an array
* `realm`

[Character API Documentation](http://blizzard.github.com/api-wow-docs/#id3380312)

[Guild API Documentation](http://blizzard.github.com/api-wow-docs/#id3381560)


***
### defaults(options)
Returns a new instance of the module where all options will default to the provided values. If the first argument of a method is a number or string, it will be used as the `name` option.

    var armory = require('armory').defaults({
        name: 'Dargonaut',
        realm: 'Shadowmoon',
        region: 'us'
    });

    armory.character(function(err, character) {
        console.log(character.name);
    });

    armory.character('Dewbaca', function(err, character) {
        console.log(character.name);
    });

    armory.character({
        name: 'Talent',
        realm: 'Lightbringer'

    }, function(err, character) {
        console.log(character.name);
    });


***
### item(options, callback)
Retrieves an object containing data about an item.
### quest(options, callback)
Retrieves an object containing data about a quest.
### recipe(options, callback)
Retrieves an object containing data about a recipe.

    var armory = require('armory').defaults({ region: 'us' });

    var avgILvl = 0,
        i = 0;

    [28275, 27903, 28041].forEach(function(id) {
        armory.item(id, function(err, item) {
            avgILvl += item.itemLevel;
            i++;

            if (i === 3) {
                avgILvl /= 3;
            }
        });
    });

Additional options:

* `fallback`: Setting to `false` disables Wowhead fallback.

[Item API Documentation](http://blizzard.github.com/api-wow-docs/#id3382086)


***
### ladder(options, callback)
Retrieves an array of objects containing data about arena teams for the given ladder and battlegroup.

    armory.ladder({
        id: '2v2',
        battlegroup: 'Vindication',
        region: 'us'

    }, function(err, ladder) {

        var factionCount = ladder.reduce(function(array, team) {
            array[team.side === 'alliance' ? 0 : 1]++;
            return array;
        }, [0, 0]);
    });

Additional options:

* `battlegroup`


***
### realmStatus(options, callback)
Retrieves an array containing the status of one or more realms.

    armory.realmStatus({ region: 'us' }, function(err, realms) {

        var queued = realms.filter(function(realm) {
            return realm.queue;
        });
    });

A single realm name or an array of realm names can be passed. If no names are provided, the status of all realms will be returned.

[Realm Status API Documentation](http://blizzard.github.com/api-wow-docs/#id3381933)


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

    armory.classes({ region: 'us', locale: 'es_MX' }, function(err, res) {
        console.log('Yo puede jugar un ' + res[9].name);
    });

`id` and `name` are not used by these methods.

[Data API Documentation](http://blizzard.github.com/api-wow-docs/#id3382202)


***
### Properties
#### publicKey, privateKey
Keys to use for generating an authorization header.

[Authentication Documentation](http://blizzard.github.com/api-wow-docs/#id3379854)


### Notes on usage:

* If an error occurs (including API errors), it will be passed as an Error object to the first argument of the callback with its message in the `message` property. Otherwise, the API response will passed as the second argument.
* `lastModified` must be a GMT Unix timestamp. If the requested resource has not been modified since the time of `lastModifed`, the callback will be invoked with both arguments empty.
* [Locale documentation](http://blizzard.github.com/api-wow-docs/#id3379677).
