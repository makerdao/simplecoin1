import 'dapple/test.sol';
import 'erc20/base.sol';
import 'factory.sol';
import 'ss.sol';

contract TestableSimpleStablecoin is SimpleStablecoin(0) {
    uint _time;
    function getTime() internal returns (uint) { return _time; }
    function setTime(uint time) { _time = time; }
}

contract SimpleStablecoinTest is Test {
    TestableSimpleStablecoin ss;
    ERC20 col;
    uint col_id;
    function setUp() {
        ss = new TestableSimpleStablecoin();
        col = new ERC20Base(10**24);
        col.approve(ss, 10**24);
        col_id = ss.registerCollateralType(col, this);
    }
    function testFactoryBuildsNonTestableVersionToo() {
        var factory = new SimpleStablecoinFactory();
        var coin = factory.newSimpleStablecoin();
        assertEq(this, coin.getOwner());
    }
    function testCreatorIsOwner() {
        assertEq(this, ss.getOwner());
    }
    function testBasics() {
        ss.setMaxDebt(col_id, 100 * 10**18);
/*
        ss.startTradeWindow(col_id, 10**17, 10**14, 300);
        var obtained = ss.purchase(col_id, 100000);
        assertEq(obtained, 999000);
        assertEq(obtained, ss.balanceOf(this));
        var before = this.balance;
        var returned = ss.redeem(col_id, ss.balanceOf(this));
        var afterward = this.balance; // `after` is a keyword??
        assertEq(returned, afterward-before);
        assertEq(returned, 99800); // minus 0.2%
*/
    }
}
