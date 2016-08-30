Simplecoin
==========

See HACKING.md for pointers on how to work on the UI.

A simplecoin is one type of stablecoin which can be run by an
individual, organization, or even a
["The TAO"](https://ryepdx.github.io/the-tao/).

It uses a reduced ETH collateral model controlled by an owner address.
In the simplest case, stablecoin holders have no protections against
the owner, but constraints can be encoded in the owner as a contract.

Some example failure modes are never refreshing the price (lost key / locked out contract), setting a bad a price (or "insider trading"), or withdrawing too much Ether. There are many different ways to handle these failure modes, which must be decided and written by each owner contract. Or, [just trust Bob](http://intheoreum.org).

The code is as simple as possible to reduce the cost of independent verification. It is just a building block that needs to be carefully constrained. It is also completely unsuitable for maintaining price stability at scale, besides also being unsuitable for any purpose in general.

The idea is to give potential [oracles](http://feedbase.io), [keepers](https://github.com/nexusdev/keeper) and [market](https://github.com/makerdao/maker-market) [makers](https://github.com/makerdao/maker-market-matcher) something to do while Maker's stablecoin engine undergoes refinement.

Using
---

```
var coin = factory.newSimpleStablecoin();

//==== If you're the owner
// add a safety buffer
coin.deposit.value(100 ether)();
// set how much you want to issue
coin.setMaxSupply(500);
// set a trade price and expiration
coin.setPrice(10**18, 10**15, block.timestamp + 300);

//==== If you're a holder
// Give up your real money
coin.purchase.value(1 ether)();
// It's a coin, LOL
coin.transfer(nikolai, coin.balanceOf(this) / 2);
// Hope the owner published a price recently
coin.redeem(coin.balanceOf(this));
```

Want to help?
---

Ask us about:

* Bug bounties
* Building UIs
* Writing tests
* Working on maker-core

https://chat.makerdao.com
