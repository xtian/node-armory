# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's REST API for World of Warcraft.

## Installation

<pre>
  npm install armory
</pre>

## Documentation

### Methods

* `realmStatus`
 * `realms` _(optional)_: String or array containing realm name(s). All realms returned if empty.
 * `region` _(optional)_: Two-letter string containing region code. Uses defaultRegion property if empty.
 * `callback(error, response)`
 
### Properties

* `defaultRegion`: Sets battle.net sub-domain to request. Defaults to `'us'`.

## Usage

<pre>
 var armory = require('armory');
 
 // All realms
 armory.realmStatus(function(err, res) {
   var realms = {};
   
   for (var i = res.length; i--;) {
     realms[res[i].slug] = res[i];
   }
 });
 
 // Specific realms
 armory.realmStatus(['Shadowmoon', 'Nazgrel'], function(err, res) {
   
 });
</pre>