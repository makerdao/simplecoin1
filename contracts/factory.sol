import 'ss.sol';
import 'ds-whitelist/factory.sol';

contract SimpleStablecoinFactory {
    mapping (uint => SimpleStablecoin) public stablecoins;
    uint public count;

    function newSimpleStablecoin(Feedbase fb, bytes32 rules
                                ,  Whitelist issuer_whitelist
                                , Whitelist transfer_whitelist )
        returns (SimpleStablecoin)
    {
        var ss = new SimpleStablecoin( fb, rules
                                     , issuer_whitelist, transfer_whitelist);
        ss.updateOwner(msg.sender);
        stablecoins[count++] = ss;
        return ss;
    }
}
