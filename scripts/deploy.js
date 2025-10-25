const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying FHEIdentityVault contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy contract
  const FHEIdentityVault = await ethers.getContractFactory("FHEIdentityVault");
  const contract = await FHEIdentityVault.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("✅ FHEIdentityVault deployed to:", address);
  console.log("\nUpdate your .env file with:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
