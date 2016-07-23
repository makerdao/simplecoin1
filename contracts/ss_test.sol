import 'dapple/test.sol';
import 'erc20/base.sol';
import 'feedbase/feedbase.sol';
import 'factory.sol';
import 'ss.sol';

contract TestableSimpleStablecoin is SimpleStablecoin {
    function TestableSimpleStablecoin(Feedbase fb, bytes32 rules)
             SimpleStablecoin(fb, rules)
    {}
    uint _time;
    function getTime() internal returns (uint) { return _time; }
    function setTime(uint time) { _time = time; }
}

contract SimpleStablecoinTest is Test {
    TestableSimpleStablecoin ss;
    Feedbase fb;
    ERC20 col;
    uint col1;
    uint24 feed1;
    function setUp() {
        fb = new Feedbase();
        ss = new TestableSimpleStablecoin(fb, 0);
        ss.setWhitelist(this, true);
        col = new ERC20Base(10**24);
        col.approve(ss, 10**24);
        feed1 = fb.claim();
        fb.set(feed1, 10**17, uint40(block.timestamp + 10));
        col1 = ss.registerCollateralType(col, this, feed1, 1000);
    }
    function testFactoryBuildsNonTestableVersionToo() {
        var factory = new SimpleStablecoinFactory();
        var coin = factory.newSimpleStablecoin(fb, "some rules");
        assertEq(this, coin.getOwner());
    }
    function testCreatorIsOwner() {
        assertEq(this, ss.getOwner());
    }
    function testBasics() {
        ss.setMaxDebt(col1, 100 * 10**18);
        var obtained = ss.purchase(col1, 100000);
        assertEq(obtained, 999000);
        assertEq(obtained, ss.balanceOf(this));
        var before = col.balanceOf(this);
        var returned = ss.redeem(col1, ss.balanceOf(this));
        var afterward = col.balanceOf(this); // `after` is a keyword??
//        assertEq(returned, afterward-before);    not true while `this` is the vault
        assertEq(returned, 99800); // minus 0.2%
    }
}
