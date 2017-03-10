pragma solidity ^0.4.8;

import "./simplecoin.sol";
import "./simple_role_auth.sol";

contract SimplecoinFactory {
    mapping (uint => Simplecoin)  public  coins;
    uint                          public  count;

    function create(DSFeeds feeds, string name, string symbol)
        returns (Simplecoin coin)
    {
        coin = new Simplecoin(feeds, name, symbol);
        var role = new SimpleRoleAuth(address(coin));
        
        coin.setAuthority(role);
        role.setRootUser(DSIAuthority(msg.sender), true);
        role.setAuthority(DSIAuthority(msg.sender));
        
        coins[count++] = coin;
    }
}
