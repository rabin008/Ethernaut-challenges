# Ethernaut challenges

The following is a walkthrough for the Ethernaut challenges using the Hardhat setup.

## Challenge 0: Hello Ethernaut

The goal of this level is to get users familiar with interacting with smart contracts. The code of the contract can be found in the _Instance.sol_ contract. The instructions of this level prompt us to call different methods sequentially. After getting setup with the _hardhat.config_ and _.env_ and getting a new instance, you can run the _Attack0.js_ script. You will need to modify the address of the instance deployed (there's a comment next to it).

The console will be showing the instructions that are required sequentially. As this script is finished, you will see that you have authenticated in the last line after following each instruction one by one. Once that this code has been run, you can submit the instance and you have completed the level.

## Challenge 1: Fallback

The point of this challenge is to first become the owner of the Smart Contract in question. Only the owner of this contract can do things like withdraw money from the contract. The second part of this challenge is to withdraw all the money from the contract. The main takeaway of this level is that you can send money to a Smart Contract using its _fallback_ function (a function with no name). Also, this function will be triggered when Ether is received by the contract.

After you get setup and create a new instance, you can modify the contract address in the _Attack1.js_ (there's a comment next to it). Once that's done, you can run this script. You will see in the console who the owner initially is and how much you have contributed to the contract, then after the _contribute_ function is called, you'll see how your balance goes up and if you check the fallback function of the contract, how you will be able to pass the require check. Finally, after calling the _fallback_ function, you will claim ownership of the contract and will be able to withdraw the funds from it.

## Challenge 2: Fallout

To complete this level, you have to claim ownership of the contract. The key takeaway from this challenge is always use the _constructor()_ function when defining a constructor in your contract. In early versions of solidity, it was common to define the constructor as a normal function with the name of the contract, this is no longer good practice. The vulnerability of the contract is that there is a typo in the function name.

After you get setup and create a new instance, you can modify the contract address in the _Attack2.js_ (there's a comment next to it). Once that's done, you can run this script. You will see in the console who the owner initially is and how calling the _Fal1out_ function will allow you to become the owner of the contract. Notice that there's a typo in **Fal1out**, which should be **Fallout**. After this you see in the console that you are the new owner, so you can submit the instance.

## Challenge 3: Coin Flip
