import "ds-auth/auth.sol";
import "ds-roles/role_auth.sol";

import "simplecoin.sol";

contract SimplecoinFactory is DSAuthUser {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(
        Feedbase    feedbase,
        bytes32     rules,
        DSAuthority authority
    ) returns (Simplecoin coin) {
        coin = new Simplecoin(feedbase, rules);
        coin.updateAuthority(authority, DSAuthModesEnum.DSAuthModes.Authority);
        coins[count++] = coin;
    }

    function create(
        Feedbase   feedbase,
        bytes32    rules
    ) returns (Simplecoin coin) {
        coin = new Simplecoin(feedbase, rules);
        DSRoleAuth authority = new SimpleRoleAuth(coin);
        coin.updateAuthority(authority, DSAuthModesEnum.DSAuthModes.Authority);
        coins[count++] = coin;
    }
}

contract SimpleRoleAuth is DSRoleAuth {
    // role identifiers
    uint8 public admin  = 0;
    uint8 public issuer = 1;
    uint8 public holder = 2;

    function SimpleRoleAuth(address target) {
        address owner = msg.sender;

        // owner can do everything by default
        setUserRole(owner, admin, true);
        setUserRole(owner, issuer, true);
        setUserRole(owner, holder, true);

        // == admin
        setRoleCapability(admin, target, sig("register(ERC20)"), true);
        setRoleCapability(admin, target, sig("setVault(uint48,address)"), true);
        setRoleCapability(admin, target, sig("setFeed(uint48,uint24)"), true);
        setRoleCapability(admin, target, sig("setSpread(uint48,uint)"), true);
        setRoleCapability(admin, target, sig("setCeiling(uint48,uint)"), true);
        setRoleCapability(admin, target, sig("unregister(uint48)"), true);

        // == issuer
        setRoleCapability(issuer, target, sig("issue(uint48,uint)"), true);
        setRoleCapability(issuer, target, sig("cover(uint48,uint)"), true);

        // == holder
        setRoleCapability(holder, target, sig("transfer(address,uint)"), true);
        setRoleCapability(holder, target, sig("transferFrom(address,address,uint)"), true);
    }

    function sig(string name) internal returns (bytes4) {
        return bytes4(sha3(name));
    }

    function addAdmin(address who) {
        setUserRole(who, admin, true);
    }
    function addIssuer(address who) {
        setUserRole(who, issuer, true);
    }
    function addHolder(address who) {
        setUserRole(who, holder, true);
    }
}
