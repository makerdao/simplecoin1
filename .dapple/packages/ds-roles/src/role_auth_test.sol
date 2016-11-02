import 'dapple/test.sol';
import './role_auth.sol';
import 'ds-auth/auth.sol';

contract authed is DSAuth {
	bool public flag1;
	bool public flag2;
	function cap1() auth {
		flag1 = true;
	}
	function cap2() auth {
		flag2 = true;
	}
}

contract DSRoleAuthTest is Test
						 , DSAuthUtils {
	DSRoleAuth r;
	authed a;
	function setUp() {
		r = new DSRoleAuth();
		a = new authed();
	}
	function testBasics() {
		uint8 root_role = 0;
		uint8 admin_role = 1;
		uint8 mod_role = 2;
		uint8 user_role = 3;

		r.setUserRole(this, root_role, true);
		r.setUserRole(this, admin_role, true);

		assertEq32( bytes32(0x3), r.getUserRoles(this) );

		r.setRoleCapability(admin_role, a, bytes4(sha3("cap1()")), true);

		assertTrue(r.canCall(this, a, bytes4(sha3("cap1()"))));
		a.cap1();
		assertTrue(a.flag1());
	

		r.setRoleCapability(admin_role, a, bytes4(sha3("cap1()")), false);
		assertFalse(r.canCall(this, a, bytes4(sha3("cap1()"))));

        assertTrue(r.hasUserRole(this, root_role));
        assertTrue(r.hasUserRole(this, admin_role));
        assertFalse(r.hasUserRole(this, mod_role));
        assertFalse(r.hasUserRole(this, user_role));
	}
}
