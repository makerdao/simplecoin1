pragma solidity ^0.4.4;

import "dapple/test.sol";
import "erc20/base.sol";
import "feedbase/feedbase.sol";
import "ds-roles/role_auth.sol";

import "simplecoin.sol";
import "simplecoin_factory.sol";

contract Vault {
    function approve(ERC20 token, address who, uint how_much) {
        token.approve(who, how_much);
    }
}

contract SimplecoinTest is Test {
    // Be explicit about units. Can force this by setting to prime
    // powers, but then percentage changes are difficult.
    uint constant COL1 = 1;
    uint constant COIN = 1;

    Simplecoin   coin;
    Feedbase     feedbase;
    Vault        vault;
    ERC20        col1;
    uint48       icol1;
    uint24       feed1;

    function setUp() {
        feedbase = new Feedbase();
        var rules = bytes32("no rules!");

        coin = new Simplecoin(feedbase, rules);

        col1 = new ERC20Base(10**24 * COL1);
        col1.approve(coin, 10**24 * COL1);

        feed1 = feedbase.claim();
        // set price to 0.1 simplecoins per unit of col1
        var price = (coin.PRICE_UNIT() * COL1) / (10 * COIN);
        feedbase.set(feed1, bytes32(price), uint40(block.timestamp + 10));

        vault = new Vault();
        vault.approve(col1, coin, uint(-1));  // pragma: no audit

        icol1 = coin.register(col1);
        coin.setVault(icol1, vault);
        coin.setFeed(icol1, feed1);
        coin.setSpread(icol1, 1000); // 0.1% either way
    }

    function testFactoryBuildsNonTestableVersionToo() {
        SimplecoinFactory factory = new SimplecoinFactory();
        var coin = factory.create(feedbase, "some rules");
        // TODO: check authority setup
    }

    function testCreatedSimplecoinHasNoAuthority() {
        assertEq(0, coin.authority());
    }

    function testBasics() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);

        var obtained = coin.issue(icol1, 100000 * COL1);

        assertEq(obtained, 999000 * COIN);
        assertEq(obtained, coin.balanceOf(this));

        var before = col1.balanceOf(this);
        var returned = coin.cover(icol1, coin.balanceOf(this));
        var afterward = col1.balanceOf(this);  // `after` is a keyword??

        assertEq(returned, afterward - before);
        assertEq(returned, 99800 * COL1); // minus 0.2%
    }

    function testIssueTransferFromCaller() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;

        var balance_before = col1.balanceOf(this);
        var obtained = coin.issue(icol1, collateral_spend);
        assertEq(balance_before - col1.balanceOf(this), collateral_spend);
    }

    function testIssueTransferToVault() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;

        var balance_before = col1.balanceOf(vault);
        var obtained = coin.issue(icol1, collateral_spend);
        assertEq(col1.balanceOf(vault) - balance_before, collateral_spend);
    }

    function testIssueTransferToCaller() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;

        var balance_before = coin.balanceOf(this);
        var obtained = coin.issue(icol1, collateral_spend);
        var balance_after = coin.balanceOf(this);

        assertEq(balance_after - balance_before, 999000 * COIN);
    }

    function testIssueCreatesCoin() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;

        var supply_before = coin.totalSupply();
        var obtained = coin.issue(icol1, collateral_spend);
        var supply_after = coin.totalSupply();

        assertEq(supply_after - supply_before, 999000 * COIN);
    }

    function testCoverTransferToCaller() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;
        var obtained = coin.issue(icol1, collateral_spend);

        var balance_before = col1.balanceOf(this);
        var returned = coin.cover(icol1, obtained);
        var balance_after = col1.balanceOf(this);

        assertEq(balance_after - balance_before, returned);
        assertEq(balance_after - balance_before, 99800 * COL1);
    }

    function testCoverTransferFromVault() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;
        var obtained = coin.issue(icol1, collateral_spend);

        var balance_before = col1.balanceOf(vault);
        var returned = coin.cover(icol1, obtained);
        var balance_after = col1.balanceOf(vault);

        assertEq(balance_before - balance_after, 99800 * COL1);
    }

    function testCoverTransferFromCaller() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;
        var obtained = coin.issue(icol1, collateral_spend);

        var balance_before = coin.balanceOf(this);
        var returned = coin.cover(icol1, obtained);
        var balance_after = coin.balanceOf(this);

        assertEq(balance_before - balance_after, 999000 * COIN);
    }

    function testCoverDestroysCoin() {
        coin.setCeiling(icol1, 10 ** 6 * COIN);
        var collateral_spend = 100000 * COL1;
        var obtained = coin.issue(icol1, collateral_spend);

        var supply_before = coin.totalSupply();
        var returned = coin.cover(icol1, obtained);
        var supply_after = coin.totalSupply();

        assertEq(supply_before - supply_after, 999000 * COIN);
    }
}

contract SimpleAuthTest is Test {
    Simplecoin coin;
    SimplecoinFactory factory;

    Feedbase feedbase;
    Vault vault;

    FakePerson admin;
    FakePerson issuer;
    FakePerson holder;

    ERC20 _token;
    uint48 _id;

    uint24 feed;

    function setUp() {
        factory = new SimplecoinFactory();
        feedbase = new Feedbase();
        var rules = bytes32("no rules!");

        coin = factory.create(feedbase, rules);

        admin = new FakePerson();
        issuer = new FakePerson();
        holder = new FakePerson();

        admin._target(coin);
        issuer._target(coin);
        holder._target(coin);

        coin.addAdmin(this);
        coin.addAdmin(admin);
        coin.addIssuer(issuer);
        coin.addHolder(holder);

        _token = new ERC20Base(1000);
        _id = coin.register(_token);
        _token.transfer(admin, 100);
        _token.transfer(holder, 100);
        _token.transfer(issuer, 100);

        var feed = feedbase.claim();
        // set price to 1:1, never expire
        feedbase.set(feed, bytes32(coin.PRICE_UNIT()), uint40(-1));
        coin.setFeed(_id, feed);

        vault = new Vault();
        vault.approve(_token, coin, uint(-1));
        coin.setVault(_id, vault);

        coin.setSpread(_id, uint(-1));     // 0% cut
        coin.setCeiling(_id, uint(-1));  // no debt limit

        //We need to allow the coin to transfer _token from the issuer
        issuer._target(_token);
        ERC20Base(issuer).approve(coin, uint(-1));
        issuer._target(coin);
    }
    
    function testSetUp() {
        // we own the authority
        assertEq(coin.owner(), address(this));
        
        /*// the authority authorises the coin
        assertEq(coin.authority(), address(authority));*/
    }

    function testCreatorIsOwner() {
        assertEq(coin.owner(), this);
    }

    function testCreatorCanTransferOwnership() {
        FakePerson newOwner = new FakePerson();
        coin.setOwner(newOwner);
        assertEq(coin.owner(), newOwner);
    }
   
    function testAdminCanRegister() {
        var token = new ERC20Base(1000);
        var id = admin.register(token);
        assertEq(coin.token(id), token);
    }
    
    function testFailIssuerRegister() {
        var token = new ERC20Base(1000);
        Simplecoin(issuer).register(token);
    }

    function testFailHolderRegister() {
        var token = new ERC20Base(1000);
        Simplecoin(holder).register(token);
    }

    function testAdminCanSetVault() {
        Simplecoin(admin).setVault(_id, 0x123);
        assertEq(coin.vault(_id), 0x123);
    }

    function testFailIssuerSetVault() {
        Simplecoin(issuer).setVault(_id, 0x123);
    }
    function testFailHolderSetVault() {
        Simplecoin(holder).setVault(_id, 0x123);
    }

    function testAdminCanSetFeed() {
        Simplecoin(admin).setFeed(_id, 123);
        assertEq(uint(coin.feed(_id)), 123);
    }
    function testFailIssuerSetFeed() {
        Simplecoin(issuer).setFeed(_id, 123);
    }
    function testFailHolderSetFeed() {
        Simplecoin(holder).setFeed(_id, 123);
    }

    function testAdminCanSetSpread() {
        Simplecoin(admin).setSpread(_id, 1000);
        assertEq(coin.spread(_id), 1000);
    }
    function testFailIssuerSetSpread() {
        Simplecoin(issuer).setSpread(_id, 1000);
    }
    function testFailHolderSetSpread() {
        Simplecoin(holder).setSpread(_id, 1000);
    }

    function testAdminCanSetCeiling() {
        Simplecoin(admin).setCeiling(_id, 1000);
        assertEq(coin.ceiling(_id), 1000);
    }
    function testFailIssuerSetCeiling() {
        Simplecoin(issuer).setCeiling(_id, 1000);
    }
    function testFailHolderSetCeiling() {
        Simplecoin(holder).setCeiling(_id, 1000);
    }

    function testAdminCanUnregister() {
        Simplecoin(admin).unregister(_id);
        assertEq(coin.token(_id), 0);
    }
    function testFailIssuerUnregister() {
        Simplecoin(issuer).unregister(_id);
    }
    function testFailHolderUnregister() {
        Simplecoin(holder).unregister(_id);
    }

    function testIssuerCanIssue() {
        Simplecoin(issuer).issue(_id, 100);
        assertEq(coin.balanceOf(issuer), 100);
    }
    function testIssuerCanCover() {
        Simplecoin(issuer).issue(_id, 100);
        Simplecoin(issuer).cover(_id, 100);
    }
    function testFailHolderIssue() {
        Simplecoin(holder).issue(_id, 100);
    }
    function testFailHolderCover() {
        Simplecoin(issuer).issue(_id, 100);
        Simplecoin(holder).cover(_id, 100);
    }

    function testHolderCanReceive() {
        Simplecoin(issuer).issue(_id, 100);
        Simplecoin(issuer).transfer(holder, 100);
        assertEq(coin.balanceOf(holder), 100);
    }
    function testHolderCanTransfer() {
        Simplecoin(issuer).issue(_id, 100);
        Simplecoin(issuer).transfer(holder, 50);
        Simplecoin(holder).transfer(admin, 25);
    }
    function testFailNonHolderReceive() {
        Tester unauthorised = new Tester();
        Simplecoin(issuer).issue(_id, 100);
        Simplecoin(issuer).transfer(holder, 50);
        Simplecoin(holder).transfer(unauthorised, 25);
    }
    function testFailNonHolderTransfer() {
        Tester unauthorised = new Tester();
        unauthorised._target(coin);

        Simplecoin(issuer).issue(_id, 100);
        Simplecoin(issuer).approve(unauthorised, 100);
        Simplecoin(unauthorised).transferFrom(issuer, holder, 25);
    }
}

contract FakePerson is Tester {
    function register(ERC20 token) returns (uint48) {
        return Simplecoin(_t).register(token);
    }
}
