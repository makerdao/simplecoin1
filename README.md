Simplecoin
==========

See HACKING.md for pointers on how to work on the UI.

A simplecoin is one type of stablecoin which can be run by an
individual or organization.

It uses a reduced Token collateral model controlled by an owner address.
In the simplest case, stablecoin holders have no protections against
the owner, but constraints can be encoded in the owner as a contract.

Some example failure modes are never refreshing the price (lost key /
locked out contract), setting a bad a price (or "insider trading"), or
withdrawing too much collateral. There are many different ways to handle
these failure modes, which must be decided and written by each owner
contract.

This simplecoin uses a flexible [access control system][ds-auth] to
limit public access. This system can be completely configured by the
contract deployer; see [below](#authentication) for more details.

[ds-auth]: https://github.com/nexusdev/ds-auth

The code is as simple as possible to reduce the cost of independent
verification. It is just a building block that needs to be carefully
constrained. It is also completely unsuitable for maintaining price
stability at scale, besides also being unsuitable for any purpose in
general.

The idea is to give potential [oracles], [keepers] and [market]
[makers] something to do while Maker's stablecoin engine undergoes
refinement.

[oracles]: http://feedbase.io
[keepers]: https://github.com/nexusdev/keeper
[market]: https://github.com/makerdao/maker-market
[makers]: https://github.com/makerdao/maker-market-matcher


Authentication
--------------

Unrestricted token access is scary! Therefore, the default for this
simplecoin is to only allow access to the owner (the contract
deployer). This isn't completely useless: for example, the owner
could use this for pre-allocation of user balances before enabling
public access.

A more flexible model is Role-Based Access Control, creating
distinct classes of user with different permissions. Simplecoins
deployed using the factory come with a simple pre-configured RBAC
that has three classes: "owner", "issuer" and "holder".

The *owner* can manage collateral types, including registration,
debt celings and price feeds; *issuers* can exchange collateral for
simplecoins (issue / cover) and form the link with *holders*, who
are able to use the simplecoin as an ERC20 token.

All questions of allocation to these user classes are left up to the
contract deployer, who can configure this as they wish.

The factory also allows creation of a Simplecoin with an arbitrary,
user-supplied authority implementing `canCall(address caller,
address callee, bytes4 sig) returns (bool)`. `canCall` determines
whether `caller` can call the function with signature `sig` at
address `callee`, and is tested for calls to any non-constant public
function, controlling selective user access.

Using
-----


Setting up the coin, with a feed and rules:

```
var fb = Feedbase(0x...);  // feedbase instance
var rules = "http://link.to.rules";  // arbitrary rules the owner is working by
var coin = Simplecoin(feedbase, rules);
```

Registration of collateral assets (owner only):

```
var ETH = ERC20(0x...);  // use the eth wrapper as a token
var eth_feed = fb.claim(ETH);  // price feed that needs to be managed

// register the collateral asset
var eth = coin.register(ETH);
// configure the collateral
coin.setVault(eth, 0x...);    // secure, auditable, storage for tokens. DIY!
coin.setFeed(eth, eth_feed);  // which price feed to follow
coin.setSpread(eth, 1000);    // skim a 0.1% profit on all ETH<->coin exchange
coin.setCeiling(eth, 10000);  // maximum quantity of coin backed by ETH

// add a buffer against value loss (optional!)
ETH.transfer(coin.vault(eth), 100 * 10 ** 18);  // 100 ETH backing...
```

Issuance:

```
// exchange 50 ETH for `how_many` coins
var how_many = coin.issue(eth, 50);
// now do what you want with the coins (maybe a holder bought them off you?)

// turn your coins back into ETH (remember owner can take a cut)
var give_me_back_my_eth = coin.cover(eth, how_many);
```

Holders can do any ERC20 operation they want, but can only transfer
to other holders.

Want to help?
---

Ask us about:

* Bug bounties
* Building UIs
* Writing tests
* Working on maker-core

https://chat.makerdao.com
