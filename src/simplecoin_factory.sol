import "ds-auth/auth.sol";
import "ds-roles/role_auth.sol";

import "simplecoin.sol";

contract SimplecoinFactory is DSAuthUser {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(Feedbase feedbase, bytes32 rules)
        returns (Simplecoin coin)
    {
        coin = new Simplecoin(feedbase, rules);

        SimpleRoleAuth authority = new SimpleRoleAuth(coin);

        // coin creator has all roles by default
        authority.addAdmin(msg.sender);
        authority.addIssuer(msg.sender);
        authority.addHolder(msg.sender);
        setOwner(authority, msg.sender);

        setAuthority(coin, authority);

        coins[count++] = coin;
    }
}

contract SimpleRoleAuth is DSRoleAuth {
    // role identifiers
    uint8 public admin  = 0;
    uint8 public issuer = 1;
    uint8 public holder = 2;

    function SimpleRoleAuth(address target) {
        // == admin
        setRoleCapability(admin, target, sig("register(address)"), true);
        setRoleCapability(admin, target, sig("setVault(uint48,address)"), true);
        setRoleCapability(admin, target, sig("setFeed(uint48,uint24)"), true);
        setRoleCapability(admin, target, sig("setSpread(uint48,uint256)"), true);
        setRoleCapability(admin, target, sig("setCeiling(uint48,uint256)"), true);
        setRoleCapability(admin, target, sig("unregister(uint48)"), true);

        // == issuer
        setRoleCapability(issuer, target, sig("issue(uint48,uint256)"), true);
        setRoleCapability(issuer, target, sig("cover(uint48,uint256)"), true);

        // == holder
        setRoleCapability(holder, target, sig("transfer(address,uint256)"), true);
        setRoleCapability(holder, target, sig("transferFrom(address,address,uint256)"), true);
    }

    function sig(string name) constant returns (bytes4) {
        return bytes4(sha3(name));
    }

    function addAdmin(address who) {
        setUserRole(who, admin, true);
        setUserRole(who, issuer, true);
        setUserRole(who, holder, true);
    }
    function addIssuer(address who) {
        setUserRole(who, issuer, true);
        setUserRole(who, holder, true);
    }
    function addHolder(address who) {
        setUserRole(who, holder, true);
    }

    function delAdmin(address who) {
        setUserRole(who, admin, false);
    }
    function delIssuer(address who) {
        setUserRole(who, issuer, false);
    }
    function delHolder(address who) {
        setUserRole(who, holder, false);
    }

    function isAdmin(address who) constant returns (bool) {
        return hasUserRole(who, admin);
    }
    function isIssuer(address who) constant returns (bool) {
        return hasUserRole(who, issuer);
    }
    function isHolder(address who) constant returns (bool) {
        return hasUserRole(who, holder);
    }

    // TODO: add this upstream
    function hasUserRole(address who, uint8 role) constant returns (bool) {
        bytes32 roles = getUserRoles(who);
        bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
        return bytes32(0) != roles & shifted;
    }
}
