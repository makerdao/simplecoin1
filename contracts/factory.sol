import 'ss.sol';

contract SimpleStablecoinFactory {
    mapping (uint => SimpleStablecoin) public stablecoins;
    uint public count;

    function newSimpleStablecoin(Feedbase fb, bytes32 rules)
        returns (SimpleStablecoin)
    {
        var ss = new SimpleStablecoin(fb, rules);
        ss.updateOwner(msg.sender);
        stablecoins[count++] = ss;
        return ss;
    }
}
