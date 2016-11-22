pragma solidity ^0.4.4;

import "simplecoin.sol";

contract SimplecoinFactory {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(Feedbase feedbase, bytes32 rules)
        returns (Simplecoin coin)
    {
        coin = new Simplecoin(feedbase, rules);

        // coin creator has all roles by default
        coin.addAdmin(msg.sender);
        
        coins[count++] = coin;
    }
}
