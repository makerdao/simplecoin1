pragma solidity ^0.4.8;

import "ds-roles/role-auth.sol";

contract SimpleRoleAuth is DSRoleAuth {
    // role identifiers
    uint8 public admin  = 0;
    uint8 public issuer = 1;
    uint8 public holder = 2;

    function SimpleRoleAuth() {
        // The coin itself will be the authority
        //setAuthority(this);
        
        // == admin
        setRoleCapability(admin, this, sig("register(address)"), true);
        setRoleCapability(admin, this, sig("setVault(uint48,address)"), true);
        setRoleCapability(admin, this, sig("setFeed(uint48,bytes12)"), true);
        setRoleCapability(admin, this, sig("setSpread(uint48,uint256)"), true);
        setRoleCapability(admin, this, sig("setCeiling(uint48,uint256)"), true);
        setRoleCapability(admin, this, sig("unregister(uint48)"), true);

        // == issuer
        setRoleCapability(issuer, this, sig("issue(uint48,uint256)"), true);
        setRoleCapability(issuer, this, sig("cover(uint48,uint256)"), true);

        // == holder
        setRoleCapability(holder, this, sig("transfer(address,uint256)"), true);
        setRoleCapability(holder, this, sig("transferFrom(address,address,uint256)"), true);
    }

    function sig(string name) constant returns (bytes4) {
        return bytes4(sha3(name));
    }

    // function setOwner(address newOwner) auth {
    //     addAdmin(newOwner);
    //     super.setOwner(newOwner);
    // }

    function addAdmin(address who) auth {
        setUserRole(who, admin, true);
        setUserRole(who, issuer, true);
        setUserRole(who, holder, true);
    }
    function addIssuer(address who) auth {
        setUserRole(who, issuer, true);
        setUserRole(who, holder, true);
    }
    function addHolder(address who) auth {
        setUserRole(who, holder, true);
    }

    function delAdmin(address who) auth {
        setUserRole(who, admin, false);
    }
    function delIssuer(address who) auth {
        setUserRole(who, issuer, false);
    }
    function delHolder(address who) auth {
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
}
