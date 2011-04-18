# node-armory

A simple [node.js](http://github.com/joyent/node) wrapper around Blizzard's REST API for World of Warcraft.

## Installation

<pre>
  npm install armory
</pre>

## Supported Methods

* `realmStatus`
 * `realms` _(optional)_: String or array containing realm name(s). Defaults to `''` which returns all realms.
 * `region` _(optional)_: two-letter string containing region code. Defaults to `'us'`.
 * `callback(error, response)`

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