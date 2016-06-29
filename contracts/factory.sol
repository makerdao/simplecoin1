import 'ss.sol';

contract SimpleStablecoinFactory {
    function newSimpleStablecoin() returns (SimpleStablecoin) {
        var ss = new SimpleStablecoin();
        ss.updateOwner(msg.sender);
        return ss;
    }
}
