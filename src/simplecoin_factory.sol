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

        DSRoleAuth authority = new DSRoleAuth();
        configureAuthority({ rbac:   authority,
                             target: coin,
                             owner:  msg.sender});

        coins[count++] = coin;
    }

    function sig(string name) internal returns (bytes4) {
        return bytes4(sha3(name));
    }

    function configureAuthority(
        DSRoleAuth rbac,
        address target,
        address owner
        )
    {
        // role identifiers
        uint8 admin  = 0;
        uint8 issuer = 1;
        uint8 holder = 2;

        // == admin
        rbac.setRoleCapability(admin, target, sig("register(ERC20)"), true);
        rbac.setRoleCapability(admin, target, sig("setVault(uint48,address)"), true);
        rbac.setRoleCapability(admin, target, sig("setFeed(uint48,uint24)"), true);
        rbac.setRoleCapability(admin, target, sig("setSpread(uint48,uint)"), true);
        rbac.setRoleCapability(admin, target, sig("setCeiling(uint48,uint)"), true);
        rbac.setRoleCapability(admin, target, sig("unregister(uint48)"), true);

        // == issuer
        rbac.setRoleCapability(issuer, target, sig("issue(uint48,uint)"), true);
        rbac.setRoleCapability(issuer, target, sig("cover(uint48,uint)"), true);

        // == holder
        rbac.setRoleCapability(holder, target, sig("transfer(address,uint)"), true);
        rbac.setRoleCapability(holder, target, sig("transferFrom(address,address,uint)"), true);

        // owner can do everything by default
        rbac.setUserRole(owner, admin, true);
        rbac.setUserRole(owner, issuer, true);
        rbac.setUserRole(owner, holder, true);

        // finally, transfer authority to the owner
        rbac.updateAuthority(owner, DSAuthModesEnum.DSAuthModes.Owner);
    }
}
