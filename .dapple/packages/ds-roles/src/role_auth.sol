import 'ds-auth/auth.sol';

contract DSRoleAuth is DSAuthority
                     , DSAuth
{
    mapping(address=>bytes32) _user_roles;
    mapping(address=>mapping(bytes4=>bytes32)) _capability_roles;

    function getUserRoles(address who)
        constant
        returns (bytes32)
    {
        return _user_roles[who];
    }
    function getCapabilityRoles(address code, bytes4 sig)
        constant
        returns (bytes32)
    {
        return _capability_roles[code][sig];
    }


    function canCall(address caller, address code, bytes4 sig)
        constant
        returns (bool)
    {
        return bytes32(0) != _user_roles[caller] & _capability_roles[code][sig];
    }

    function BITNOT(bytes32 input) constant returns (bytes32 output) {
        return (input ^ bytes32(uint(-1)));
    }

    function setUserRole(address who, uint8 role, bool enabled)
        auth
    {
        var last_roles = _user_roles[who];
        bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
        if( enabled ) {
            _user_roles[who] = last_roles | shifted;
        } else {
            _user_roles[who] = last_roles & BITNOT(shifted);
        }
    }

    function setRoleCapability(uint8 role, address code, bytes4 sig, bool enabled)
        auth
    {
        var last_roles = _capability_roles[code][sig];
        bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
        if( enabled ) {
            _capability_roles[code][sig] = last_roles | shifted;
        } else {
            _capability_roles[code][sig] = last_roles & BITNOT(shifted);
        }

    }

    function hasUserRole(address who, uint8 role) constant returns (bool) {
        bytes32 roles = getUserRoles(who);
        bytes32 shifted = bytes32(uint256(uint256(2) ** uint256(role)));
        return bytes32(0) != roles & shifted;
    }
}
