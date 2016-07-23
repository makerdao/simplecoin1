import 'ss.sol';

contract SimpleStablecoinFactory {
    function newSimpleStablecoin(Feedbase fb, bytes32 rules) returns (SimpleStablecoin) {
        var ss = new SimpleStablecoin(fb, rules);
        ss.updateOwner(msg.sender);
        return ss;
    }
}
