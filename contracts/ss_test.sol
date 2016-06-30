import 'dapple/test.sol';
import 'factory.sol';
import 'ss.sol';

contract TestableSimpleStablecoin is SimpleStablecoin {
    uint _time;
    function getTime() internal returns (uint) { return _time; }
    function setTime(uint time) { _time = time; }
}

contract SimpleStablecoinTest is Test {
    TestableSimpleStablecoin ss;
    function setUp() {
        ss = new TestableSimpleStablecoin();
    }
    function testFactoryBuildsNonTestableVersionToo() {
        SimpleStablecoinFactory factory;
        var coin = factory.newSimpleStablecoin();
    }
    function testCreatorIsOwner() {
        assertEq(this, ss.getOwner());
    }
    function testBasics() {
        ss.setMaxSupply(100 * 10**18);
        ss.setPrice(10**17, 10**14, 300);
        var obtained = ss.purchase.value(100000)();
        assertEq(obtained, 999000);
        assertEq(obtained, ss.balanceOf(this));
        var before = this.balance;
        var returned = ss.redeem(ss.balanceOf(this));
        var afterward = this.balance; // `after` is a keyword??
        assertEq(returned, afterward-before);
        assertEq(returned, 99800); // minus 0.2%
    }
}
