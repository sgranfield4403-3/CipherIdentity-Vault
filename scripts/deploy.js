const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("Deploying FHEIdentityVault contract...");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("\n📍 Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (parseFloat(ethers.formatEther(balance)) < 0.01) {
    console.warn("⚠️ Warning: Low balance, deployment may fail");
  }

  console.log("\n🔨 Compiling and deploying contract...");

  // Deploy contract
  const FHEIdentityVault = await ethers.getContractFactory("FHEIdentityVault");
  const contract = await FHEIdentityVault.deploy();

  console.log("⏳ Waiting for deployment confirmation...");
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n" + "=".repeat(60));
  console.log("✅ FHEIdentityVault deployed successfully!");
  console.log("=".repeat(60));
  console.log("\n📄 Contract address:", address);
  console.log("\n📝 Update your .env file with:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
