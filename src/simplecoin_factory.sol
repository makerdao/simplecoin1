import "ds-whitelist/factory.sol";

import "simplecoin.sol";

contract SimplecoinFactory {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(
        Feedbase   feedbase,
        bytes32    rules,
        Whitelist  issuers,
        Whitelist  holders
    ) returns (Simplecoin result) {
        result = new Simplecoin(feedbase, rules, issuers, holders);
        result.setOwner(msg.sender);
        coins[count++] = result;
    }
}
