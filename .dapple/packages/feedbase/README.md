Feedbase
========

This small, self-contained Ethereum contract lets you create "feeds"
that you can use to publish arbitrary 32-byte values, with attached
expiration dates to prevent consumers from reading stale data.

Perhaps most interestingly, the owner of a feed has the ability to tax
on-chain consumers (i.e., smart contracts) for making use of the feed.
This happens at most once for each feed value (to the first consumer).
The reason for this is that you couldn't really prevent anyone from
creating a simple contract that would repeat your feed values anyway.
However, you're free to publish new values again as often as you want.

The prices can be changed at any time, although for security reasons
the address of the underlying ERC20 token can only ever be set once.

One obvious application of Feedbase is publishing financial data to
smart contracts that rely on "oracles" in a nice, standardized way.
Another interesting use case is for configuration of smart contracts.

Think of Feedbase as a piece of low-level Ethereum infrastructure:
it's free for anyone to use, and not owned or controlled by anyone.


Getting started
---------------

Feedbase comes with a simple commmand-line tool for managing feeds:

    npm install -g feedbase

For anything to happen, you obviously need to run an Ethereum node:

    geth --testnet --rpc --unlock 7


Working with feeds
------------------

To start putting out values, first you need to claim your feed:

    feedbase claim

If you want to be able to tax your smart contract consumers, this step
is where you specify the address of your (ERC20-compatible) token:

    feedbase claim 0x4244e29ec71fc32a34dba8e89d4856e507d1bc87

If nothing goes wrong (sad to say, the CLI is a bit flaky sometimes),
within a minute you should see something like this:

    {
      "id": "7302",
      "token": "0x0000000000000000000000000000000000000000",
      "owner": "0x34e510285d96cdc6063d5447763afea0acd61baa",
      "label": "",
      "price": "0x0",
      "timestamp": 0,
      "expiration": 0,
      "unpaid": false
    }

Now you can do a few things.  You can inspect the feed at will:

    feedbase inspect 7302

**Note:**  Unfortunately, although you are an off-chain consumer who
can in principle read the value of any feed for free, the `feedbase
inspect` command cannot currently display the actual value of a feed.

You can set an arbitrary label (32 bytes maximum):

    feedbase set-label 7302 "Temperature in Central Park"

If you specified a token, you can change the price:

    feedbase set-price 7302 0x10000000

You can transfer ownership of the feed to another account:

    feedbase set-owner 7302 0x4b51d646f0e3677411b27101d2a3f09223a8372e

You can also continuously watch the blockchain for all Feedbase events:

    feedbase watch

Now, to actually update the feed value, you'd use a command like this:

    feedbase set 7302 0x0000000000000000000000000000000490000000000000000000000000000000 1467204471

Here, we're setting the value of feed number 7302 to the number 73
represented in 128x128 fixed-point notation.  The expiration date is
set to June 29 12:47:51 UTC 2016 (represented in standard Unix time).

Again, the values can be anything as long as they fit within 32 bytes.

That's it!


More information
----------------

For more details, take a look at the following files:

    contracts/feedbase.sol
    contracts/feedbase_test.sol
    bin/feedbase
    lib/feedbase.js

You can also check out Keeper (<https://github.com/nexusdev/keeper>),
an "admin toolkit for incentive-following software daemons," designed
to do things like publishing price feeds to blockchains.

Happy hacking!
