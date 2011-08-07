# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's [REST API for World of Warcraft](http://blizzard.github.com/api-wow-docs/).

## Installation

    npm install armory

## Documentation

### Methods

#### realmStatus
* `realms` _(optional)_: String or array containing realm(s). All realms returned if empty.
* `region` _(optional)_: Two-letter region code. Defaults to `defaultRegion`.
* `callback(error, response)`
  
#### character, guild
* `options`: String in the form `'Name_Realm'` or object with the following properties:
 * `names`: String or array containing name(s).
 * `fields` _(optional)_: Array of optional fields to request.
 * `realm` _(optional)_: Realm name. Overridden if provided in name string.
 * `region` _(optional)_: Two-letter region code. Defaults to `defaultRegion`.
 * `locale` _(optional)_: Locale string in the form xx_XX.
* `callback(error, response)`: Called once for each character/guild requested.
  
#### arena
* `options`: String in the form `'Name_Size_Realm'`, `'Name_Size'`, or `'Name_Realm'`, or object with the following properties:
 * `names`: String or array containing name(s).
 * `size` _(optional)_: One of `'2v2'`, `'3v3'`, or `'5v5'`. Overridden if provided in name string.
 * `fields` _(optional)_: Array of optional fields to request.
 * `realm` _(optional)_: Realm name. Overridden if provided in name string.
 * `region` _(optional)_: Two-letter region code. Defaults to `defaultRegion`.
 * `locale` _(optional)_: Locale string in the form xx_XX.
* `callback(error, response)`: Called once for each team requested.

#### item
* `id`: String, integer, or array containing item ID(s).
* `region` _(optional)_: Two-letter region code. Defaults to `defaultRegion`.
* `locale` _(optional)_: Locale string in the form xx_XX.
* `callback(error, response)`: Called once for each item requested.
  
#### perks, rewards, classes, races
* `region` _(optional)_: Two-letter region code. Defaults to `defaultRegion`.
* `locale` _(optional)_: Locale string in the form xx_XX.
* `callback(error, response)`

#### auction resources (step 1)
* `realm`: String or array containing realm slug(s).
* `region` _(optional)_: Two-letter region code. Defaults to `defaultRegion`.
* `callback(error, response)`

#### auction resources (step 2)
* `uri`: String or the `'files'` object returned in step 1.
* `callback(error, response)`
 
### Properties

`defaultRegion`: Default battle.net sub-domain to request. Defaults to `'us'`.
  
`publicKey`: Public key for authentication.
  
`privateKey`: Private key for authentication.

## Usage

    var armory = require('armory');
    
    armory.publicKey = 'publickey';
    armory.privateKey = 'privatekey';
    
    // Single character
    armory.character('Dargonaut_Shadowmoon', function(err, character) {
      
    });
    
    // Multiple characters
    armory.character({
      names: ['Dargonaut', 'Dewbaca', 'Therago_Nazgrel'],
      fields: ['items','talents'],
      realm: 'Shadowmoon'
    }, function(err, character) {
      
    });
    
    // Multiple realms
    armory.realmStatus(['Shadowmoon', 'Nazgrel'], function(err, res) {
      
    });
    
    // Multiple items
    armory.item([28275, 27903, 28041], function(err, item) {
      
    });

	// Auctions dump info for a single realm
	armory.auction('sentinels', function(err,data) {
		
	});
	
	// Auctions dump info for multiple realms
	armory.auction(['sentinels','thrall'], function(err,data) { 
		
	});
	
	// Auctions data
	armory.auctiondata("http://us.battle.net/auction-data/medivh/auctions.json", function (err, auctions) {
	
	});
	
    // Auctions dump and data for multiple realms (step 1 and 2 combined)
	armory.auction(['sentinels','thrall'], function(err,data) { 
	    if (err) { throw err; }
	    
		armory.auctiondata(data.files, function (err, auctions) {
	        if (err) { throw err; }
	        
			/* Do something with the data */
	    });
	});