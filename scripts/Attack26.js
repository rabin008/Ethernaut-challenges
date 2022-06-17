const hre = require("hardhat");
const delegateABI = require("../artifacts/contracts/Challenge 26/DoubleEntryPoint.sol/Forta.json"); // get ABI from logic contract

async function main() {
  // First get victim contract
  const Victim = await ethers.getContractFactory("DoubleEntryPoint");
  const victim = await Victim.attach(
    "0x0626D38C378F6506B0837BA99EcCe71B96284787" // This is the contract address that you get from starting your instance
  );

  // Then we get the address of the cryptovault
  const value1 = await victim.cryptoVault();
  console.log("The address of the vault is ", value1);

  // Then we deploy the detection bot to the cryptovault
  const MyContract = await ethers.getContractFactory("DetectionBot");

  // Deploy contract
  const contract = await MyContract.deploy(value1);
  await contract.deployed();

  console.log(`Deployed contract to: ${contract.address}`);

  // Finally we register it in the Forta contract
  const [owner, addr1] = await ethers.getSigners(); // get your account

  // address of forta contract
  const address1 = await victim.forta();
  console.log("The address of Forta contract is ", address1);

  // Use interface to set detection bot in that contract
  const delgateInterface = new ethers.utils.Interface(delegateABI.abi);
  const data1 = delgateInterface.encodeFunctionData(`setDetectionBot`, [
    contract.address,
  ]);
  const attack1 = await owner.sendTransaction({
    to: address1,
    data: data1, // we pass in the data variable obtained above
    gasLimit: 100000, // to not get error gas
  });

  await attack1.wait(1);
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
