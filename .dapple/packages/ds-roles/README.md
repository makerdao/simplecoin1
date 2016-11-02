ds-roles
===

A `DSAuthority` that manages up to 256 **roles**.

In the context of the Role Authority, a **user** is the sender,
while a **capability** is a `(code,sig) :: (address,bytes4)` pair.

The ability to check permissions in constant time is entirely due to
the artificial constraint on number of roles.

256 was chosen because this lets us abuse the large word size and
cheap bitwise operations.


Usage
-----

Start using role based auth by inheriting from `DSAuth`, applying
the `auth` modifier to protected functions and setting the
`_authority` to one derived from `DSRoleAuth`.



*Roles* are (currently) assigned by number:

```
uint8 owner_role = 0;
uint8 user_role = 1;

setUserRole(owner_address, owner_role, true);
setUserRole(user_address, user_role, true);
```

The roles that an address has can be inspected, either all at once:

```
bytes32 roles = getUserRoles(user_address)
```

or, for convenience, by testing whether a given user has a given
role:

```
bool is_owner = hasUserRole(owner_address, owner_role);
bool is_user = hasUserRole(owner_address, user_role);

assertTrue(is_owner);
assertFalse(is_user);
```


*Capabilities* are assigned to each role, allowing access to
functions (by signature) at an address:

```
address target = 0x123;  // code address

bytes4 withdraw_sig = bytes4(sha3("withdrawAll()"));
setRoleCapability(owner_role, target, withdraw_sig);

bytes4 deposit_sig = bytes4(sha3("deposit(uint256)"));
setRoleCapability(user_role, target, deposit_sig);
```

The roles that have access to a specific capability can be
inspected:

```
bytes32 permitted_roles = getCapabilityRoles(target, sig);
```
