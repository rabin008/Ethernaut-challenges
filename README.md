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

From this challenge we will learn the nuance between using the global variables _tx.origin_ and _msg.sender_. As, we know, in Ethereum there are two types of accounts, EOAs which are the ones that can make transactions and Smart Contract accounts which can call functions on other contracts but can't make transactions. The logic behind completing this level is realizing that if we make a contract call a function on another contract, the variable _msg.sender_ will be the Smart Contract since it is the one making the call but the variable _tx.origin_ will be us since we are the ones making the transacion.

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

## Challenge 8: Vault

We will learn from this challenge that nothing is confidential in a blockchain, even when variables are denoted as _private_ in solidity. This is mainly because blockchains are immutable and deterministic, which means data are stored in them forever and cannot be changed. It's important to know that marking a variable as _private_ only prevents other contracts from accessing it which does not mean that they can't be accessed by users through their storage in the blockchain. You can check the following link to learn more about visibility functions in solidity:

https://docs.soliditylang.org/en/v0.7.1/cheatsheet.html?highlight=visibility#function-visibility-specifiers

If you really want to ensure that your data is private, it needs to be encrypted before put onto the blockchain.

After you get setup and create a new instance, you can modify the contract address in the _Attack8.js_ (there is a comment next to it). This will allow to get access to the victim contract which we will be interacting with. First we verify what the value of the _locked_ public variable is and then we get its value by using the _getStorageAt_ function from _ethers_. You can see that the value is in hex and it can be transformed to ASCII, however we will be passing the hex value to the function that will change the value of the _locked_ variable. Finally, we will verify that the value of the variable indeed has changed.

## Challenge 9: King

The key takeaway from this challenge is that we have to be extremely careful when making external calls to other contracts. This is because we don't know what type of logic the functions from an unknown contract could do. In this particular case, the function that will be containing the malicious logic will be the _fallback_ since the victim contract will be making calls to this function because it will be sending Ether to them. This level is based on a true game that existed in the Ethereum blockchain, for more details, you can check the following link:

https://www.kingoftheether.com/thrones/kingoftheether/index.html

After you get setup and create a new instance, you can modify the contract addresses in the _Attack9.js_ (there are comments next to them). This will allow us to attach the victim's contract and check who the king is and what is the current prize that we have to increase to become the new kings. After that, we deploy the attack contract which contains a logic in the _fallback_ function such that any transaction would be reverted, that is how we will remain kings even after another account overcomes our current prize. We just pass in more Ether than the current prize in the deployment of the attack contract. Finally, we verify that we have become the new kings.

## Challenge 10: Re-entrancy

This level will give us an example of one of the most known attacks in the Ethereum blockchain, mostly because it has led to some of the most devastating attacks. Examples of this are the well known _DAO_ attack which had such a colossal effect because it meant around a 50 million dollar loss and in turn led to people agreeing to modify the blockchain for the first and only time so far. In fact, this hack caused the Ethereum blockchain to fork into the official Ethereum blockchain which is the one we currently use and Ethereum classic which is the original one. For more details about this hack, you can check the following links:

DAO hack: [https://www.coindesk.com/learn/2016/06/25/understanding-the-dao-attack/](https://www.coindesk.com/learn/2016/06/25/understanding-the-dao-attack/)

Ethereum Classic: [https://ethereumclassic.org/guides/basics](https://ethereumclassic.org/guides/basics)

After you get setup and create a new instance, you can modify the contract addresses in the _Attack10.js_ (there are comments next to them). This will allow us to attach the victim's contract and check its initial balance, then it will deploy the attack contract and donate from it the exact Ether necessary to drain the victim contract. After that, we will call the malicious _fallback_ function which in turn will call the _withdraw_ function from the attack contract to the victim contract. Finally, we will verify that indeed the balance has been removed from _Reentrance_ conract.

## Challenge 11: Elevator

In this level we will learn some concepts about how some concepts work in solidity. First of all, an interface specifies methods that a contract has to implement, but it doesn't specify the logic inside of that function, it leaves that job for the developer. In this case we will define the logic of the functions. Interfaces are used to design contracts and create an API for contracts which help standardize what types of calls can be implemented, although the logic can be very different. We will also learn about the state modifiers, in this case, the _return_ key word which actually allows for modification of state. You can check both of this concepts in detail in the next links:

Interfaces: https://medium.com/coinmonks/solidity-tutorial-all-about-interfaces-f547d2869499

State modifiers: https://docs.soliditylang.org/en/v0.7.1/cheatsheet.html?highlight=visibility%20specifiers#modifiers

After you get setup and create a new instance, you can modify the contract addresses in the _Attack11.js_ (there are comments next to them). This will allow us to attach the victim's contract and check the initial values of the _floor_ and _top_ public variables, then it will deploy the attack contract with the interface definition and call the _setTop_ function from it, what this function in turn will do is call the _goTo_ function from the victim contract. The important thing to understand is how to define the interface so that it passes the correct values when being checked in the return calls.

## Challenge 12: Privacy

This challenge will exemplify again that nothing in a blockchain is private even when it is defined as such in solidity and is passed into an array. Also it will be a great starting point to understand how storage works because there are some rules that optimize storage and this is really important when developing smart contracts since it will allow to save gas. The following link describes in detail how storage works and what are some of this optimization techniques:

https://medium.com/@dariusdev/how-to-read-ethereum-contract-storage-44252c8af925

Furthermore, it will give a little introduction to casting which in very simple words is changing an object to a different type, although this is not a correct definition.

After you get setup and create a new instance, you can modify the contract addresses in the _Attack12.js_ (there are comments next to them). This will allow us to attach the victim's contract and check the initial value of the _locked_ public variable, then it will deploy the attack contract which will do the casting before calling the _unlock_ function. Therefore, our only task is to get the information from the correct storage slot. Since some of the variables are included in the same storage slot, you will realize that the correct one is number 5. With this, we will call the _unlock_ function and verify that the value of _locked_ has indeed changed.

## Challenge 13: Gatekeeper One

We will learn from this challenge about several properties we can use in Solidity. The first one of them is masking which is basically combining bits to get a result wanted, the second is the concept of _gasleft_ that is better explained in Solidity's documentation (link below) and finally we will get a refresher about the _telephone_ level because we will make use of the difference between _msg.sender_ and _tx.origin_. The way in which we will learn about each of them is by passing three require statements, each one covers a different concept. Useful links:

gasleft: https://docs.soliditylang.org/en/v0.8.3/control-structures.html#external-function-calls
Masking: https://en.wikipedia.org/wiki/Mask_(computing)

After you get setup and create a new instance, you can modify the contract addresses in the _Attack13.js_ (there are comments next to them). This will allow us to attach the victim's contract and check the initial value of the _entrance_ public variable, then it will deploy the attack contract that contains the malicious function _letMeIn_. This function will try different values such that the condition of the modulo will be passed. The key to understand the other two require statements is to understand masking, basically we want the last 8 and 16 digits to be equal and the last 32 and 16 digits to be different. Therefore we define the variable as such in the attack contract using masking.

## Challenge 14: Gatekeeper Two

This level is really similar to the previous, to beat it we have to pass three require statements that will allow us to understand different concepts about solidity. The first one is exactly the same as the previous level, the second one is learning about the _assembly_ function in solidity which allows to access the EVM at a lower level and the _extcodesize_ that allows to get the size of another contract. Finally the last concept is bitwise operators, in particular the _xor_ (^). The important thing to know about this operator for the challenge is that if $a+b=c$ then $a+c=b$. The following links give detailed explanations about the two concepts:

Inline Assembly: https://docs.soliditylang.org/en/v0.8.7/assembly.html

Bitwise operators: https://www.loginradius.com/blog/engineering/how-does-bitwise-xor-work/#:~:text=XOR%20is%20a%20bitwise%20operator,)%20else%20true(1).

After you get setup and create a new instance, you can modify the contract addresses in the _Attack14.js_ (there are comments next to them). This will allow us to attach the victim's contract and check the initial value of the _entrance_ public variable, then it will deploy the attack contract that calls the _enter_ function with the correct value on deployment (the logic is in the _constructor_), which is obtained from the property mentioned in the last paragraph. This is done since the size of the contract is 0 while deploying, therefore passing the second gate. Finally, we verify that we have entered the contract.

## Challenge 15: Naught coin

This level will teach us about the **ERC-20 token standard**, one of the most common standards known. In simple words, it allows us to create an ABI to interact with tokens. The main functionalities are that it allows us to transfer tokens from one account to another, get the current balance of an account, approve to send a certain amount of tokens to another address, between others. This implementation consists of 9 functions including the _transfer_ and _transferFrom_ functionns that are key to passing this level. You can check more about this in the following link:

https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

After you get setup and create a new instance, you can modify the contract address in the _Attack15.js_ (there is a comment next to it). This will allow to get access to the victim contract which we will be interacting with. First we verify what the balance of our account is since the goal of this level is to get our balance to 0. After that and understading the difference between the _transfer_ and _transferFrom_ functionns, we approve to send tokens and then send them via the _transferFrom_ function since it won't be possible from the normal _transfer_ method due to the lock-up period imposed in the victim contract. Finally, we verify that our balance is 0 to know that we have completed the level.

## Challenge 16: Preservation

In this level, we will find another nuance of the _delegatecall_ function, also it will help us better understand how storage works in solidity. The key takeaway again is that we have to be really careful when we use _delegatecall_. In this case, it shows us that this is particularly true when we are working with contract libraries that have their own state. This example demonstrates why the _library_ keyword should be used for building libraries, as it prevents the libraries from storing and accessing state variables. The vulnerability actually comes from using the _contract_ keyword when we are defining what is what we want to use _delegatecall_ on. For more details, you can check the following links:

Delegatecall: https://medium.com/@InternationalCryptox./solidity-delegate-call-some-gotchas-1d4e23e4ef6e

Library keyword fro preventing attacks: https://betterprogramming.pub/preventing-smart-contract-attacks-on-ethereum-delegatecall-e864d0042188

After you get setup and create a new instance, you can modify the contract address in the _Attack16.js_ (there is a comment next to it). This will allow us to attach the victim's contract and check the initial values of the _timeZone1Library_ and _owner_ public variables, then it will deploy the attack contract and call the _setFirstTime_ function passing as an argument the address of the deployed contract. Since _delegatecall_ will change the state of the _Preservation_ contract, it will change where _timeZone1Library_ is pointing because it is in the first storage slot. Then, it will call the _setFirstTime_ function again but this time the _delegatecall_ function will follow the logic of our malicious contract address which changes the owner variable to our address. Finally, it checks that we are indeed the owners.

## Challenge 17: Recovery

We will learn from this challenge how to recover the contract's address from a contract that has been deployed, also it will help us review the _selfdestruct_ function. There are several ways in which we can obtain the address of a contract, according to Ethereum's yellow paper, the contract address of a deployed contract is determined by the creator of it and the nonce. Consequently, as long as we have access to both of them, we will be able to recover any address. In this repo we will be using the _getContractAddress_ from the _ethers_ package. The two following links provide more useful information to better understand how to beat this level:

Ethereum Yellowpaper: https://ethereum.github.io/yellowpaper/paper.pdf

Explore contracts on Etherscan: https://info.etherscan.com/explore-contract-address/

After you get setup and create a new instance, you can modify the contract address in the _Attack17.js_ (there is a comment next to it). This will allow to get access to the victim contract and use the _getContractAddress_ using the first nonce to obtain the contract address of the _SimpleToken_ contract that was deployed. After recovering the required address, we can directly call the _destroy_ function that will _selfdestruct_ the contract and send us its balance. Finally, we verify that the balance of the contract is indeed 0 and therefore we have passed the challenge.

## Challenge 18: MagicNumber

This challenge will force us to understand some of the low level of solidity, since we will have to create a function that is less than 10 opcodes. In very general terms, the opcodes turn into bytecodes which are the instructions that the EVM actually reads when something gets executed. During the creation of a contract there are two types of codes that get passed to the EVM, the first one is the _initialization code_ and de second is the _runtime code_. We will have to create a contract that returns the number 42 when it gets called. To create the hashed bytecodes that we are going to pass to the transaction to create the contract, the following links are really useful:

Explanation 1: https://medium.com/coinmonks/ethernaut-lvl-19-magicnumber-walkthrough-how-to-deploy-contracts-using-raw-assembly-opcodes-c50edb0f71a2

Explanation 2: https://github.com/r1oga/ethernaut#hack-17

After you get setup and create a new instance, you can modify the contract address in the _Attack18.js_ (there is a comment next to it). This will allow to get access to the victim contract and see what the _address_ variable initially is. Then we send a transaction that sends the bytecodes necessary to create a contract that returns the number 42. To see a full depth explanation, check the links above since it is really technical. After that, we call the _setSolver_ function passing the contract address from the deployed contract and verify that indeed the public variable _adress_ has changed.

## Challenge 19: Alien Codex

This level will solidify our understanding of storage, but this time we will be working with dynamically sized arrays instead of static variables like before. It will also be useful to remember what _modifiers_ are and lastly, it will show us that the EVM doesn't validate an ABI-encoded length versus its actual payload. One important thing to know to beat this challenge is that every contract on Ethereum has the same storage as dynamically sized arrays $2^{256}$ (indexing starting from 0). The vulnerability from the contract will come from not checking for underflows when modifying the array size, this is by not following the Checks Effects Interactions. For more in depth explanation, check following links:

Checks Effects Interactions: https://docs.soliditylang.org/en/v0.6.11/security-considerations.html

Explanation storage: https://coder-question.com/cq-blog/525391

After you get setup and create a new instance, you can modify the contract address in the _Attack19.js_ (there is a comment next to it). This will allow to get access to the victim contract and see what the public _contact_ and _owner_ variables initially are. Then we call the _makeContact_ function to pass access to the other functions and call the _retract_ function to cause an underflow of the size of the array. Finally, we call the _revise_ function by passing as arguments the 0th storage position of the array and our address padded, which is obtained by concatenating 0's to our public address, then we verify that we are the new owners.

## Challenge 20: Denial

This challenge will review some of the concepts that we have learn throught the Ethernaut, it will remind us about the Checks Effects Interactions and the three different ways in which we can send Ether. Additionally, it will help us better understand what error handling is by showing us the difference between _revert_, _require_ and _assert_ and finally, it will introduce us a bit more about the concept of gas. In this case, we will learn how the _call_ function in solidity allows us to specify the amount of gas sent in a transaction, however, if the gas parameter is not specified, all gas will be transfered into the function call. Actually this is where the vulnerability mainly lies. Some useful links are:

Error handling: https://docs.soliditylang.org/en/v0.8.9/control-structures.html?highlight=assert%20require%20revert#panic-via-assert-and-error-via-require

Sending Ether: https://docs.soliditylang.org/en/v0.8.9/security-considerations.html?highlight=transfer%20ether#sending-and-receiving-ether

After you get setup and create a new instance, you can modify the contract address in the _Attack20.js_ (there is a comment next to it). This will allow to get access to the victim contract and see what the initial balance of the _owner_ is. Then it will deploy the attack contract and call the _setWithdrawPartner_ passing the contract address of the deployed conntract as an argument, therefore making this contract the current partner in the victim contract. Since the malicious _receive_ function in this attack contract doesn't allow to get pass this call because it drains all the gas through the _assert_ function, we will have completed the level. Finally, we call the _withdraw_ function to verify that indeed the balance of the owner is not changing anymore.

## Challenge 21: Shop

This level will be really useful to remember how _interfaces_ work in solidity. In very simple words, they establish how we are going to be able to interact with funcions, i.e, the visibility, name of the function and arguments but it diesn't specify the logic behind what is going to be doing. The importance of _interfaces_ rely in that they standardize how we'll be able to interact with function but not in how they are going to be implemented. Another takeaway from this challenge is that we have to be really careful when we are going to make external calls to contracts we have not defined. THe following link provides relevant information:

https://www.educative.io/answers/what-is-solidity-interface

After you get setup and create a new instance, you can modify the contract addresses in the _Attack21.js_ (there are comments next to them). This will allow to get access to the victim contract and see what the initial values of _price_ and _isSold_ are. Since the value of _isSold_ is already false, we just have to pay attention to the first condition in the if statement which verifies the value of _price_. However, if we look inside the if statement, we can see that there is a state change, we'll be able to exploit that by defining the _price_ function to be dependent on the value of _isSold_ just like we define the function in the attack contract. After we implement our attack contract and call the _buy_ function, we verify that the value of _price_ is indeed smaller than 100.

## Challenge 22: Dex

We will learn from this challenge how Dexes work and the importance of defining the _swap_amounts_ correctly. Additionaly, it will serve as an example to understand how operations with decimals work on solidity. First of all, we have to realize that the biggest vulnerability of this Dex is in the function _getSwapPrice_ since it's not using any price oracles, that is, it is assuming that the value of both token is always the same and that leads to a malicious actor being able to manipulate the Dex if they have a large amount of one token. That is reason why for this attack we will be swapping all of our tokens, each time getting more from the other token, being able to manipulate the market. The following two links are useful to understand Dexes and how to use data feeds to get prices of tokens.

Dexes: https://en.wikipedia.org/wiki/Decentralized_finance#Decentralized_exchanges

Chainlink Data Feeds: https://docs.chain.link/docs/get-the-latest-price/

After you get setup and create a new instance, you can modify the contract's address in the _Attack22.js_ (there is a comment next to it). This will allow to get access to the victim contract and see the initial balances of your account and the contract. After that, we call the _approve_ function to allow the contract to use our token with the _transferFrom_ function. Since we have 10 tokens from each and the contract has 100 of each, we start by swapping all our tokens to the other. Doing the math, we will receive $10*100/100=10$ from the other token. So our updated balance will be 0 from one token and 20 from the other and the contract's balance will be 110 from one token and 90 from the other. The next swap will grant us $20*90/110=1024.4...=24$, here is where we see the effect of not dealing with decimals and after checking the contract balance of 86 of one token and 110 of the other, we see that we are starting to drain the contract's balance of one token. We continue to swap until we finish draining the balance of one token.

## Challenge 23: Dex Two

This challenge will be really similar to the previous one but with one very important difference that is the omission of the following require statement:

```
require((from == token1 && to == token2) || (from == token2 && to == token1), "Invalid tokens");
```

The require statement was critical for the purpose of the Dex, since it verified that only the two tokens created in the contract where the ones used. The removal of the line leads to several possible attacks from the creation of another malicious token that has no real value. Also, it is an important lesson to know that even if a contract implements the ERC-20 specs doesn't mean it's trustworthy. Specifically, if you design a Dex where anyone can create and use their own tokens, the correctenss of the Dex fully depends on the logic with which the swaps are made. The following links go in depth about the ERC-20 specs and represent one additional real attack that is kind of similar to this one:

ERC-20 specs: https://eips.ethereum.org/EIPS/eip-20

Similar attack: https://slowmist.medium.com/paraluni-incident-analysis-58be442a4f99

After you get setup and create a new instance, you can modify the contract addresses in the _Attack23.js_ (there are comments next to them). This will allow to get access to the victim contract and deploy the attack contract. Also, it will allow to check the initial balances of your account and the contract. After that, we call the _approve_ function to allow the contract to use our token with the _transferFrom_ function. Since the attack contract has send the exact amount of tokens to our address and to the victim contract address, we just have to swap two times according to the respective ratios in the liquidity pool to drain the balance of the two tokens, Finally, we verify we have received the total amount of the two tokens while the contract's balance only has the malicious token we created.

## Challenge 24: Puzzle Wallet

This level will introduce us to upgradeable contracts, in this case, a **Transparent Proxy pattern**. A **proxy contract** in very general words is a contract that intends to keep the state of all the variables kept in storage. It always goes along with an **implementation contract** which tells the proxy contract what logic to use. These contracts are upgradeable in terms that they can change the logic from the implementation contract. As useful as they can be, they are risky since they come with a lot of details that we have to put attention to when using them. In this case, the problem lies on the storage because there are variables specifically at slot 0 and 1 that clash, allowing us to explot that vulnerability switching back and forth the states of these two variables in this two contracts. The following two materials go deeper into proxy contracts:

Proxy contracts: https://blog.openzeppelin.com/proxy-patterns/

Delegatecall: https://medium.com/coinmonks/delegatecall-calling-another-contract-function-in-solidity-b579f804178c#:~:text=DelegateCall%2C%20as%20the%20name%20implies,contract%20but%20on%20caller%20contract.

After you get setup and create a new instance, you can modify the contract's address in the _Attack24.js_ (there is a comment next to it). This will allow to get access to the victim contract and the ABI's of both contracts, this is since we'll be sending data to call functions instead of calling methods directly. First we will call the _proposeNewAdmin_ function from the _call_ method by passing the data because we are interacting with the implementation contract, you can also get the direct contract on Etherscan. After we are owners, we can call the _addToWhitelist_ to pass modifiers and call the _multicall_ function with an rray of two elements with one diferent to the deposit selector to pass require statement. Finally, call _execute_ function to drain funds from the contract and pass the other require statement to be able to change the variable that is in storage 0 by calling the _setMaxBalance_ function.

## Challenge 25: Motorbike

Similrly to the previous level, we'll be exploring vulnerabilities in **proxy contracts**, only that in this case it will be a **Universal Upgradeable Proxy Standard (UUPS)** instead of a Transparent proxy. The key difference between these two is that the UUPS contains the logic to upgrade in the _implementation contract_ as opposed to the TPP that contains it in the _proxy contract_. One of the biggest advantages of using the UPPS is that it saves gas since there'll always only exist one address in which the implementing contract will be, however there are also risks involved with this pattern, this challenge will introduce to a very specific vulnerability that happens when the logic contract is not directly initialized. The following links are very useful to get more in depth information about this patterns and how they work.

UUPS: https://eips.ethereum.org/EIPS/eip-1822

UUPS (specifics): https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786

UUPS (attack): https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680

After you get setup and create a new instance, you can modify the contract's address in the _Attack25.js_ (there is a comment next to it). This will allow to get access to the victim contract and get the position at which the logic contract is stored, we will use this address to initialize the contract directly. After we do this, we'll become the upgraders and therefore, we'll be able to call the functions from the logic contract directly. Consequently, after deploying the attack contract, we call the _upgradeToAndCall_ passing as an argument the address of the deployed contract and the data to call the _attack_ function from this contract. This will allow us to call the _selfdestruct_ function from the actual implementation contract, since this is changed when the _upgradeToAndCall_ is executed. Therefore, no more upgrades will be able to get done and the current implementation contract will be destroyed, loosing all the logic forever and the ability to upgrade.

## Challenge 26: DoubleEntryPoint

This level will teach us about the creation of detection bots to monitor threats and vulnerabilities. About the contract, the desired behaviour of the _CryptoVault_ is that it can sweep any token except for the underlying token, that is because of how the _sweepToken_ function is defined in the _CryptoValut_ contract. However, the problem is that we can actually transfer the underlying token indirectly by calling the _transfer_ function from the Legacy token, which is actually what is done when we call the _sweepToken_ function passing as a parameter the address of the _LegacyToken_ contract. This is a clear example of a **Double Entry Point token** since we can access it directly via the _sweep_ function and indirectly following the way just explained. The detectionbot created was taken from the following link as well some other useful links below:

Code detection bot: https://github.com/maAPPsDEV/double-entry-point-attack/blob/main/contracts/DetectionBot.sol

Great explanation about this level: https://www.youtube.com/watch?v=aGnC_917YOY&t=886s

After you get setup and create a new instance, you can modify the contract's address in the _Attack26.js_ (there is a comment next to it). This will allow to get access to the victim contract and the address of the cryptovault since we are going to actually be interacting with _DoubleEntryPoint_ contract by default. Then, after deploying the detection bot by passing as an argument the address of the cryptovault, we can register our detection bot to forta. For this we will actually have to use the _encodeFunctionData_ method because we're not interacting with the Forta contract directly in our instance.
