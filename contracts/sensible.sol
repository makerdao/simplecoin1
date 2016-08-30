contract Sensible {
    function() { throw; }

    function assert(bool condition) internal {
        if (!condition) throw;
    }

    modifier noEther() {
        assert(msg.value == 0);
        _
    }

    // WARNING:
    // Must manually confirm that no function with a `mutex` modifier
    // has a `return` statement, or else mutex gets stuck.
    bool locked;
    modifier mutex() {
        assert(!locked);
        locked = true;
        _
        locked = false;
    }

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
