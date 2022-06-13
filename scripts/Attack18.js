const hre = require("hardhat");

async function main() {
  var bytecode =
    "0x6080604052348015600f57600080fd5b5069602a60005260206000f3600052600a6016f3fe"; // Define the bytecode that returns 42

  const Victim = await ethers.getContractFactory("MagicNum");
  const victim = await Victim.attach(
    "0xEa004C0fc9fEb176B3657bA7690d7613406c7B83" // This is the contract address that you get from starting your instance
  );

  // Check the initial value of address
  const value1 = await victim.solver();
  console.log("The address variable initially is ", value1);

  // Deploy contract defined from bytecode
  const [owner, addr1] = await ethers.getSigners(); // get your account
  const contract = await owner.sendTransaction({
    data: bytecode,
  });
  await contract.wait(1);

  console.log("Deployed contract to", contract.creates);

  // Now execute solver function passing the address of our deployed contract
  const attack = await victim.setSolver(contract.creates);
  await attack.wait(1);

  // Check that the address variable has changed
  const value2 = await victim.solver();
  console.log("The address variable now is ", value2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
