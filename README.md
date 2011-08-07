# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's [REST API for World of Warcraft](http://blizzard.github.com/api-wow-docs/).

## Installation

    npm install armory


## Documentation


### auction(realm|realms|options, [region,] callback)
Retrieves an array of auction data URLs.

### auctionData(realm|realms|options, [region,] callback)
Retrieves an object of data from the first auction data URL provided by the API.
    
    armory.auctionData('Shadowmoon', function(err, res) {
        
        var agiPots = res.alliance.auctions.filter(function(auction) {
            return auction.item === 58145;
        });
    });
    
The first argument can be a string, an array, or an object with the following properties:

* `realms`
* `region` _(optional)_
* `lastModified` _(optional)_

[Auction API Documentation](http://blizzard.github.com/api-wow-docs/#id3683980)

***
### arena(options, callback)
Retrieves an object containing data about an arena team.

    armory.arena('I wish we had a pally_5v5_Shadowmoon', function(err, team) {
        
        var ratio = team.gamesWon / team.gamesLost;
    });

`options` can be a string in the form `'Name_Size_Realm'` or an object with the following properties:

* `names`
* `size` _(optional)_
* `realm` _(optional)_
* `region` _(optional)_
* `locale` _(optional)_

`names` can be either a string or array of strings in the form `'Name_Size_Realm'`, `'Name_Size'`, or `'Name_Realm'`. Parameters specified in name strings will override those provided in the `options` object.


***
### character(options, callback)
Retrieves an object containing data about a character.
### guild(options, callback)
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
            fields: ['appearance']
            realm: 'Shadowmoon'
            
        }, function(err, character) {
            hairColors.push(character.appearance.hairColor);
            
        });
    });

`options` can be a string in the form `'Name_Realm'` or an object with the following properties:

* `names`
* `fields` _(optional)_: must be an array
* `realm` _(optional)_
* `region` _(optional)_
* `lastModified` _(optional)_
* `locale` _(optional)_

`names` can be either a string or array of strings in the form `'Name_Realm'`. Parameters specified in name strings will override those provided in the `options` object.

[Character API Documentation](http://blizzard.github.com/api-wow-docs/#id3682393)
  
[Guild API Documentation](http://blizzard.github.com/api-wow-docs/#id3683544)


***
### item(id|ids, [region, locale,] callback)
Retrieves an object containing data about an item.
    
    var avgILvl = 0,
        i = 0;
    
    armory.item([28275, 27903, 28041], function(err, item) {
        avgILvl += item.itemLevel;
        i++;
        
        if (i === 3) {
            avgILvl /= 3;
        }
    });
    
The first argument can be a single item ID or an array of IDs.

[Item API Documentation](http://blizzard.github.com/api-wow-docs/#id3684151)
    
    
***    
### realmStatus([realm|realms, region,] callback)
Retrieves an array containing the status of one or more realms.

    armory.realmStatus(function(err, realms) {
        
        var queued = realms.filter(function(realm) {
            return realm.queue;
        });
    });

A realm name or array of realm names can be passed as the first argument. If no realms are provided, the status of all realms will be returned.

[Realm Status API Documentation](http://blizzard.github.com/api-wow-docs/#id3683928)


***
### classes([region, locale,] callback)
Retrieves a static array of data about character classes.
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
* `lastModified` must be a GMT Unix timestamp. If the requested resource has not been modified since the time of `lastModifed`, the callback will be invoked with both arguments `undefined`.
* Regions must be one of `'us'`, `'eu'`, `'kr'`, or `'tw'`.
* Available locales are [documented in this post](http://us.battle.net/wow/en/forum/topic/2878487920).
