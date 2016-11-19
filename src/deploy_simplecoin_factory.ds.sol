pragma solidity ^0.4.4;

import "dapple/script.sol";
import "./simplecoin_factory.sol";

contract DeploySimplecoinFactory is Script {
  function DeploySimplecoinFactory () {
    exportObject("factory", new SimplecoinFactory());
  }
}
