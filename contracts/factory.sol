import 'ss.sol';

contract SimpleStablecoinFactory {
    function newSimpleStablecoin() returns (SimpleStablecoin) {
        var ss = new SimpleStablecoin(0);
        ss.updateOwner(msg.sender);
        return ss;
    }
}
