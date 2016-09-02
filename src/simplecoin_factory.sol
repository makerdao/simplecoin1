import "ds-auth/auth.sol";
import "ds-whitelist/whitelist.sol";

import "simplecoin.sol";

contract SimplecoinFactory is DSAuthUser {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(
        Feedbase   feedbase,
        bytes32    rules,
        DSRoleAuth authority
    ) returns (Simplecoin coin) {
        coin = new Simplecoin(feedbase, rules);
        coin.updateAuthority(authority, DSAuthModesEnum.DSAuthModes.Authority);
        coins[count++] = coin;
    }
}
