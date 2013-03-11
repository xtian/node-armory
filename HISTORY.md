# 0.6.0 / 2013-03-10
* [changed] `Connection: keep-alive` header is no longer passed by default.
* [changed] A Stream is now returned by all API methods if no callback is passed.
* [changed] The full `options` object is now passed to [request](https://github.com/mikeal/request). Fixes #3.
* [changed] The full response object is passed as the third parameter of the callback.
* [changed] `ladder` has been renamed to `arenaLadder`.
* [added] Achievement endpoint: `achievement`
* [added] Battle pet endpoints: `battlePetAbility`, `battlePetSpecies`, `battlePetStats`
* [added] Challenge mode endpoints: `challenge`, `challengeRegion`
* [added] Item set endpoint: `itemSet`
* [added] Rated BG endpoint: `rbgLadder`
* [added] Spell endpoint: `spell`
* [removed] `auctionData`
* [removed] Wowhead fallback support
* [fixed] `encodeUri` now performed on path before creating authentication header. Fixes #6.
* [fixed] Date header now passed when performing authentication. Fixes #7.
