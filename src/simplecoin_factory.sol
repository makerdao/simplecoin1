import "ds-auth/auth.sol";
import "ds-whitelist/whitelist.sol";

import "simplecoin.sol";

contract SimplecoinFactory is DSAuthUser {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(
        Feedbase   feedbase,
        bytes32    rules
    ) returns (Simplecoin result) {
        var issuers = new Whitelist();
        var holders = new Whitelist();
        setOwner(issuers, msg.sender);
        setOwner(holders, msg.sender);
        result = new Simplecoin(feedbase, rules, issuers, holders);
        result.setOwner(msg.sender);
        coins[count++] = result;
    }
}
