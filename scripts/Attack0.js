const hre = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("Instance");
  const contract = await MyContract.attach(
    "0x346D20C0e419Dd983a13B3a5d611650090dB0032" // This is the contract address that you get from starting your instance
  );

  // The instructions prompt to execute the following method
  const info = await contract.info();
  console.log(info);

  // Following the instructions from previous call
  const info1 = await contract.info1();
  console.log(info1);

  // Following the instructions from previous call
  const info2 = await contract.info2("hello");
  console.log(info2);

  // Following the instructions from previous call
  const infoNum = await contract.infoNum();
  console.log("The number of the next method to call is", infoNum);

  // Following the instructions from previous call
  const info42 = await contract.info42();
  console.log(info42);

  // Following the instructions from previous call
  const methodName = await contract.theMethodName();
  console.log("The next method to call is", methodName);

  // Following the instructions from previous call
  const method7123949 = await contract.method7123949();
  console.log(method7123949);

  //Then we can just call the public variable password
  const password = await contract.password();
  console.log("The password is", password);

  // Finally we can call the authenticate function with the password as an argument
  await contract.authenticate(password);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
