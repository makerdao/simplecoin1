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
    Whitelist transferrers;
    Feedbase fb;
    Vault vault;
    ERC20 col1;
    uint icol1;
    uint24 feed1;
    uint constant COL1 = 10 ** 18;

    function setUp() {
        issuers = new Whitelist();
        issuers.setWhitelisted(this, true);

        transferrers = new Whitelist();
        transferrers.setWhitelisted(this, true);

        fb = new Feedbase();
        ss = new TestableSimpleStablecoin(fb, 0, issuers, transferrers);

        ss.setWhitelist(this, true);

        issuers.setWhitelisted(ss, true);
        issuers.setEnabled(true);

        transferrers.setWhitelisted(ss, true);
        transferrers.setEnabled(true);

        col1 = new ERC20Base(10**24);
        col1.approve(ss, 10**24);

        feed1 = fb.claim();
        // set price to 0.1 simplecoins per unit of col1
        fb.set(feed1, bytes32(COL1 / 10), uint40(block.timestamp + 10));

        vault = new Vault();
        vault.approve(col1, ss, uint(-1));  // pragma: no audit

        icol1 = ss.registerCollateralType({token: col1,
                                           vault: vault,
                                           feedID: feed1,
                                           spread: 1000  // 0.1% either way
                                          });
    }
    function testFactoryBuildsNonTestableVersionToo() {
        var factory = new SimpleStablecoinFactory();
        var coin = factory.newSimpleStablecoin( fb, "some rules"
                                              , issuers, transferrers );
        assertEq(this, coin.owner());
        // TODO: check authority setup
    }
    function testCreatorIsOwner() {
        assertEq(this, ss.owner());
    }
    function testBasics() {
        ss.setMaxDebt(icol1, 100 * COL1);

        var obtained = ss.purchase(icol1, 100000);

        assertEq(obtained, 999000);
        assertEq(obtained, ss.balanceOf(this));

        var before = col1.balanceOf(this);
        var returned = ss.redeem(icol1, ss.balanceOf(this));
        var afterward = col1.balanceOf(this);  // `after` is a keyword??

        assertEq(returned, afterward - before);
        assertEq(returned, 99800); // minus 0.2%
    }
}
