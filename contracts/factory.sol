import 'ss.sol';
import 'ds-whitelist/factory.sol';

contract SimpleStablecoinFactory {
    function newSimpleStablecoin( Whitelist issuer_whitelist
                                , Whitelist transfer_whitelist )
        returns (SimpleStablecoin)
    {
        var ss = new SimpleStablecoin(issuer_whitelist, transfer_whitelist);
        ss.updateOwner(msg.sender);
        return ss;
    }
}
