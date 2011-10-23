# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's [REST API for World of Warcraft](http://blizzard.github.com/api-wow-docs/).

## Installation

    npm install armory


## Documentation


All options objects can have the following properties:

* `names`|`ids`
* `region` _(optional)_
* `locale` _(optional)_
* `lastModified` _(optional)_

Note: `names` and `ids` are interchangeable, and `locale` and `lastModified` do not affect all API methods.

***
### auction(options, callback)
### auction(realms, [region, locale,] callback)
Retrieves an array of auction data URLs.

### auctionData(options, callback)
### auctionData(realms, [region, locale,] callback)
Retrieves an object of data from the first auction data URL provided by the API.

    armory.auctionData('Shadowmoon', function(err, res) {

        var agiPots = res.alliance.auctions.filter(function(auction) {
            return auction.item === 58145;
        });
    });

The first argument can be a string, an array, or an object.

[Auction API Documentation](http://blizzard.github.com/api-wow-docs/#id3683980)


***
### arena(options, callback)
### arena('Name\_Size\_Realm', [region, locale,] callback)
Retrieves an object containing data about an arena team.

    armory.arena('No Dairy_2v2_Shadowmoon', function(err, team) {

        var ratio = team.gamesWon / team.gamesLost;
    });

`options` can be a string in the form `'Name_Size_Realm'` or an object with the following additional properties:

* `size` _(optional)_
* `realm` _(optional)_

Strings in the form `'Name_Size_Realm'`, `'Name_Size'`, or `'Name_Realm'` can be used in the `names` property. Parameters specified in these strings will override those provided in the `options` object.

[Arena Team API Documentation](http://blizzard.github.com/api-wow-docs/#id3382144)

***
### character(options, callback)
### character('Name\_Realm', [region, locale,] callback)
Retrieves an object containing data about a character.
### guild(options, callback)
### guild('Name\_Realm', [region, locale,] callback)
Retrieves an object containing data about a guild.

    armory.guild({
        names: 'The Gentlemens Club',
        fields: ['members'],
        realm: 'Shadowmoon'

    }, function(err, guild) {

        var dwarves = guild.members.reduce(function(array, member) {
            if (member.character.race === 3) {
                array.push(member.character.name);
            }

            return array;
        }, []);

        var hairColors = [];

        armory.character({
            names: dwarves,
            fields: ['appearance'],
            realm: 'Shadowmoon'

        }, function(err, character) {
            if (err) return;
            hairColors.push(character.appearance.hairColor);
        });
    });

`options` can be a string in the form `'Name_Realm'` or an object with the following additional properties:

* `fields` _(optional)_: must be an array
* `realm` _(optional)_

Strings in the form `'Name_Realm'` can be used in the `names` property. Parameters specified in these strings will override those provided in the `options` object.

[Character API Documentation](http://blizzard.github.com/api-wow-docs/#id3682393)

[Guild API Documentation](http://blizzard.github.com/api-wow-docs/#id3683544)


***
### item(options, callback)
### item(ids, [region, locale,] callback)
Retrieves an object containing data about an item.
### quest(options, callback)
### quest(ids, [region, locale,] callback)
Retrieves an object containing data about a quest.

    var avgILvl = 0,
        i = 0;

    armory.item([28275, 27903, 28041], function(err, item) {
        avgILvl += item.itemLevel;
        i++;

        if (i === 3) {
            avgILvl /= 3;
        }
    });

The first argument can be a single item ID, an array of IDs, or an object.

[Item API Documentation](http://blizzard.github.com/api-wow-docs/#id3684151)


***
### ladder(sizes, battlegroup, [region, locale,] callback)
Retrieves an array of objects containing data about arena teams for the given ladder and battlegroup.

    armory.ladder('2v2', 'Vindication', function(err, ladder) {

        var factionCount = ladder.reduce(function(array, team) {
            array[team.side === 'alliance' ? 0 : 1]++;
            return array;
        }, [0, 0])
    });

The first argument can be a single item ID, an array of IDs, or an object with the following additional properties:

* `battlegroup`


***
### realmStatus([realms, region, locale,] callback)
Retrieves an array containing the status of one or more realms.

    armory.realmStatus(function(err, realms) {

        var queued = realms.filter(function(realm) {
            return realm.queue;
        });
    });

A realm name or array of realm names can be passed as the first argument. If no names are provided, the status of all realms will be returned.

[Realm Status API Documentation](http://blizzard.github.com/api-wow-docs/#id3683928)


***
### battlegroups([region, locale,] callback)
Retrieves a static array of all battlegroup names.
### characterAchievements([region, locale,] callback)
Retrieves a static array of all character achievements.
### classes([region, locale,] callback)
Retrieves a static array of data about character classes.
### guildAchievements([region, locale,] callback)
Retrieves a static array of all guild achievements.
### perks([region, locale,] callback)
Retrieves a static array of data about guild perks.
### races([region, locale,] callback)
Retrieves a static array of data about character races.
### rewards([region, locale,] callback)
Retrieves a static array of data about guild rewards.

    armory.classes('es_MX', function(err, res) {
        console.log('Yo puede jugar un ' + res[9].name);
    });

[Data API Documentation](http://blizzard.github.com/api-wow-docs/#id3684070)


***
### Properties
#### defaultRegion
The region to use if none is specified. `'us'` by default.

#### publicKey, privateKey
Keys to use for generating an authorization header.

[Authentication Documentation](http://blizzard.github.com/api-wow-docs/#id3681959)


### Notes on usage:

* If an error occurs (including API errors), it will be passed as an Error object to the first argument of the callback with its message in the `message` property. Otherwise, the API response will passed as the second argument.
* Except for `realmStatus()`, all methods invoke the callback once for each resource requested.
* `lastModified` must be a GMT Unix timestamp. If the requested resource has not been modified since the time of `lastModifed`, the callback will be invoked with both arguments empty.
* [Locale documentation](http://blizzard.github.com/api-wow-docs/#id3379677).
