pragma solidity ^0.4.4;

contract Sensible {
    bool locked;

    modifier synchronized() {
        assert(!locked);
        locked = true;
        _;
        locked = false;
    }

    function() { throw; }
    function assert(bool x) internal { if (!x) throw; }
    modifier noeth() { assert(msg.value == 0); _; }

    function safeToAdd(uint a, uint b) internal returns (bool) {
        return (a + b >= a);
    }

    function safeToSub(uint a, uint b) internal returns (bool) {
        return (a >= b);
    }

    function safeToMul(uint a, uint b) internal returns (bool) {
        var c = a * b;
        return (a == 0 || c / a == b);
    }
}
