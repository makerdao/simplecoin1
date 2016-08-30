import 'dapple/test.sol';
import 'erc20/base.sol';
import 'feedbase/feedbase.sol';
import 'factory.sol';
import 'ss.sol';

contract TestableSimpleStablecoin is SimpleStablecoin {
    function TestableSimpleStablecoin( Feedbase fb, bytes32 rules
                                     , Whitelist w1, Whitelist w2)
             SimpleStablecoin(fb, rules, w1, w2)
    {}
    uint _time;
    function getTime() internal returns (uint) { return _time; }
    function setTime(uint time) { _time = time; }
}

contract Vault {
    function approve(ERC20 token, address who, uint how_much) {
        token.approve(who, how_much);
    }
}

contract SimpleStablecoinTest is Test {
    TestableSimpleStablecoin ss;
    Whitelist issuers;
    Whitelist holders;
    Feedbase fb;
    Vault vault;
    ERC20 col1;
    uint icol1;
    uint24 feed1;
    uint constant COL1 = 10 ** 18;

    function setUp() {
        issuers = new Whitelist();
        issuers.setWhitelisted(this, true);

        holders = new Whitelist();
        holders.setWhitelisted(this, true);

        fb = new Feedbase();
        ss = new TestableSimpleStablecoin(fb, 0, issuers, holders);

        issuers.setWhitelisted(ss, true);
        issuers.setEnabled(true);

        holders.setWhitelisted(ss, true);
        holders.setEnabled(true);

        col1 = new ERC20Base(10**24);
        col1.approve(ss, 10**24);

        feed1 = fb.claim();
        // set price to 0.1 simplecoins per unit of col1
        fb.set(feed1, bytes32(COL1 / 10), uint40(block.timestamp + 10));

        vault = new Vault();
        vault.approve(col1, ss, uint(-1));  // pragma: no audit

        icol1 = ss.register({
            token: col1,
            vault: vault,
            feedID: feed1,
            spread: 1000, // 0.1% either way
        });
    }
    function testFactoryBuildsNonTestableVersionToo() {
        var factory = new SimpleStablecoinFactory();
        var coin = factory.newSimpleStablecoin(
            fb, "some rules", issuers, holders
        );
        assertEq(this, coin.owner());
        // TODO: check authority setup
    }
    function testCreatorIsOwner() {
        assertEq(this, ss.owner());
    }
    function testBasics() {
        ss.setCeiling(icol1, 100 * COL1);

        var obtained = ss.purchase(icol1, 100000);

        assertEq(obtained, 999000);
        assertEq(obtained, ss.balanceOf(this));

        var before = col1.balanceOf(this);
        var returned = ss.redeem(icol1, ss.balanceOf(this));
        var afterward = col1.balanceOf(this);  // `after` is a keyword??

        assertEq(returned, afterward - before);
        assertEq(returned, 99800); // minus 0.2%
    }
    function testPurchaseTransferFromCaller() {
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;

        var balance_before = col1.balanceOf(this);
        var obtained = ss.purchase(icol1, collateral_spend);
        assertEq(balance_before - col1.balanceOf(this), collateral_spend);
    }
    function testPurchaseTransferToVault() {
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;

        var balance_before = col1.balanceOf(vault);
        var obtained = ss.purchase(icol1, collateral_spend);
        assertEq(col1.balanceOf(vault) - balance_before, collateral_spend);
    }
    function testPurchaseTransferToCaller() {
        // stablecoin transferred from caller
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;

        var balance_before = ss.balanceOf(this);
        var obtained = ss.purchase(icol1, collateral_spend);
        var balance_after = ss.balanceOf(this);

        assertEq(balance_after - balance_before, 999000);
    }
    function testPurchaseCreatesCoin() {
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;

        var supply_before = ss.totalSupply();
        var obtained = ss.purchase(icol1, collateral_spend);
        var supply_after = ss.totalSupply();

        assertEq(supply_after - supply_before, 999000);
    }
    function testRedeemTransferToCaller() {
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;
        var obtained = ss.purchase(icol1, collateral_spend);

        var balance_before = col1.balanceOf(this);
        var returned = ss.redeem(icol1, obtained);
        var balance_after = col1.balanceOf(this);

        assertEq(balance_after - balance_before, returned);
        assertEq(balance_after - balance_before, 99800);
    }
    function testRedeemTransferFromVault() {
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;
        var obtained = ss.purchase(icol1, collateral_spend);

        var balance_before = col1.balanceOf(vault);
        var returned = ss.redeem(icol1, obtained);
        var balance_after = col1.balanceOf(vault);

        assertEq(balance_before - balance_after, 99800);
    }
    function testRedeemTransferFromCaller() {
        // stablecoin transferred from caller
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;
        var obtained = ss.purchase(icol1, collateral_spend);

        var balance_before = ss.balanceOf(this);
        var returned = ss.redeem(icol1, obtained);
        var balance_after = ss.balanceOf(this);

        assertEq(balance_before - balance_after, 999000);
    }
    function testRedeemDestroysCoin() {
        ss.setCeiling(icol1, 100 * COL1);
        var collateral_spend = 100000;
        var obtained = ss.purchase(icol1, collateral_spend);

        var supply_before = ss.totalSupply();
        var returned = ss.redeem(icol1, obtained);
        var supply_after = ss.totalSupply();

        assertEq(supply_before - supply_after, 999000);
    }
}
