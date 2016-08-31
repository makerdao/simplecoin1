import "dapple/test.sol";
import "erc20/base.sol";
import "feedbase/feedbase.sol";

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
    Whitelist    issuers;
    Whitelist    holders;
    Feedbase     feedbase;
    Vault        vault;
    ERC20        col1;
    uint48       icol1;
    uint24       feed1;

    function setUp() {
        issuers = new Whitelist();
        issuers.setWhitelisted(this, true);

        holders = new Whitelist();
        holders.setWhitelisted(this, true);

        feedbase = new Feedbase();
        coin = new Simplecoin(feedbase, 0, issuers, holders);

        issuers.setWhitelisted(coin, true);
        issuers.setEnabled(true);

        holders.setWhitelisted(coin, true);
        holders.setEnabled(true);

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
        var factory = new SimplecoinFactory();
        var coin = factory.create(feedbase, "some rules", issuers, holders);
        assertEq(this, coin.owner());
        // TODO: check authority setup
    }

    function testCreatorIsOwner() {
        assertEq(this, coin.owner());
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
