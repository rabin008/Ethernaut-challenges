# Ethernaut challenges

The following is a walkthrough for the Ethernaut challenges using the Hardhat setup. You should follow the instructions before running the respective scripts.

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

This challenge will teach us that we can't create random numbers directly in a blockchain, mainly because they're deterministic by nature. Descentralized oracle networks such as _Chainlink_ function as providers of off-chain data. For example, they allow for the generation of verifiable random numbers, price data feeds, etc. The idea behind hacking any contract that tries to produce randomness in a blockchain is that you can replicate its logic in an attack contract. In this case, we will guess the produced number ten times in a row.

After you get setup and create a new instance, you can modify the contract addresses in the _Attack3.js_ (there are comments next to them). This will allow to get access to the victim contract, then it will deploy the _CoinFilpAttack.sol_ and will call the malicious _flip_ function which by replicating the logic of the creation of the random number, will guess the value correctly. Then we will repeat the same process 10 times. The contract in the Github repo does this one time because you can get gas errors if you try to make the 10 straight calls in a row in the same script. **Therefore, you will have to run the script ten times to submit the instance and pass te level**.

## Challenge 4: Telephone

From this challenge, we will learn the nuance between using the global variables _tx.origin_ and _msg.sender_. As, we know, in Ethereum there are two types of accounts, EOAs which are the ones that can make transactions and Smart Contract accounts which can call functions on other contracts but can't make transactions. The logic behind completing this level is realizing that if we make a contract call a function on another contract, the variable _msg.sender_ will be the Smart Contract since it is the one making the call but the variable _tx.origin_ will be us since we are the ones making the transacion.

After you get setup and create a new instance, you can modify the contract addresses in the _Attack4.js_ (there are comments next to them). This will allow to get access to the victim contract, then it will deploy the _TelephoneAttack.sol_ contract and will call the _hackContract_ function which by passing the if statement for the reasons given above, will transfer ownership to the **address that you should define in your _.env_**. Finally, it will call the _owner_ public variable to verify that you are now the owner.

## Challenge 5: Token

This challenge will show us how to produce underflows. An undeflow happen when you substract an amount to a number such that the resulting number is smaller than the smallest number defined. Before solidity v0.8, you could prevent this vulnerabilities from hapenning by using the SafeMath library. From v0.8 onwards, SafeMath is automatically integrated into your contracts when you set the pragma directive to 0.8 and above. Check following github repo to see how this works:

https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol

After you get setup and create a new instance, you can modify the contract addresses in the _Attack5.js_ (there are comments next to them). This will allow to get access to the victim contract and pass in your address as an argument to the _transfer_ function. The logic behind the attack consists in calling the _transfer_ fucntion so that it causes an underflow. As you can see in the script code, the second argument is _21_, this is because the operation $20-21$ will be negative and we have defined a _unit_ for the variable. You can see in the _transfer_ function that after passing the require statement, the balance will be updated, making the balance a very big number.

## Challenge 6: Delegation

This challenge will allow us to understand the logic behind the _delegatecall_ function which in very simple words is using the logic from another contract to modify the state of the current contract. This is actually the reason why these types of calls become very vulnerable. In this level, we will use the logic from the _Delegate_ contract's _pwn_ function to alter the state of the _Delegation_ contract which is the one we want to take ownership of. A useful reading material to understand _delegatecall_ functionality is:

https://medium.com/coinmonks/delegatecall-calling-another-contract-function-in-solidity-b579f804178c

After you get setup and create a new instance, you can modify the contract address in the _Attack6.js_ (there is a comment next to it). This will allow to get access to the victim contract which we will be interacting with. First we verify who the owner is and then we make use of the _delegatecall_ logic that is in the _fallback_ function of the _Delegation_ contract to claim ownership. We pass the _data_ necessary to the _fallback_ function in order to call the _pwn_ logic from the Delegate contract. Additionaly, we set the gas limit to avoid getting a reverted transaction. Finally, we verify that we are the new owners.

## Challenge 7: Force

This level will show us that there is always a way to transfer Ether to a contract. Even when there are no payable functions nor a _fallback_ or _receive_ function. The way in which we can do this is by using the _selfdestruct_ function which in very simple terms sends Ether to an address before it destroys itself. To get a deeper understanding of what this function actually does, you can check solidity's documentation in the following link:

https://docs.soliditylang.org/en/v0.8.13/introduction-to-smart-contracts.html

After you get setup and create a new instance, you can modify the contract addresses in the _Attack7.js_ (there are comments next to them). Before running the script, you can check the instance address on the Rinkeby Etherscan to verify that the contract's balance is 0. Running the script will allow to get access to the victim contract and deploy the _ForceAttack.sol_ contract, then it will call the _selfdestruct_ function passing as an argument 1 wei. This will destroy the just deployed contract and will transfer the Ether to the Force contract from the instance. Finally, you can verify on the Rinkeby Etherscan that the balance of the instance contract has increased and therefore you have completed the challenge.
