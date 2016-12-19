pragma solidity ^0.4.4;

import "simplecoin.sol";

contract SimplecoinFactory {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(Feedbase200 feedbase, string name, string symbol)
        returns (Simplecoin coin)
    {
        coin = new Simplecoin(feedbase, name, symbol);

        // coin creator has all roles by default
        coin.addAdmin(msg.sender);
        coin.setOwner(msg.sender);
        
        coins[count++] = coin;
    }
}
