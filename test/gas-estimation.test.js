const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Gas Estimation Tests for FHEIdentityVault
 *
 * These tests estimate gas costs for various operations.
 * Useful for optimizing contract performance.
 */
describe("FHEIdentityVault Gas Estimation", function () {
  let vault;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();

    const FHEIdentityVault = await ethers.getContractFactory("FHEIdentityVault");
    vault = await FHEIdentityVault.deploy();
    await vault.waitForDeployment();
  });

  describe("Deployment Gas", function () {
    it("should report deployment gas cost", async function () {
      const FHEIdentityVault = await ethers.getContractFactory("FHEIdentityVault");
      const deployTx = await FHEIdentityVault.getDeployTransaction();

      const estimatedGas = await ethers.provider.estimateGas({
        data: deployTx.data,
      });

      console.log(`    Deployment gas estimate: ${estimatedGas.toString()}`);

      // Reasonable deployment gas should be less than 5M
      expect(estimatedGas).to.be.lessThan(5000000n);
    });
  });

  describe("Read Operations Gas", function () {
    it("should report hasIdentity gas cost", async function () {
      const gas = await vault.hasIdentity.estimateGas(owner.address);
      console.log(`    hasIdentity gas: ${gas.toString()}`);

      // View functions should be very cheap
      expect(gas).to.be.lessThan(50000n);
    });

    it("should report totalIdentities gas cost", async function () {
      const gas = await vault.totalIdentities.estimateGas();
      console.log(`    totalIdentities gas: ${gas.toString()}`);

      expect(gas).to.be.lessThan(50000n);
    });
  });

  describe("Contract Size", function () {
    it("should have reasonable bytecode size", async function () {
      const code = await ethers.provider.getCode(await vault.getAddress());
      const sizeInBytes = (code.length - 2) / 2; // Remove '0x' and convert hex to bytes
      const sizeInKB = sizeInBytes / 1024;

      console.log(`    Contract size: ${sizeInBytes} bytes (${sizeInKB.toFixed(2)} KB)`);

      // Contract should be less than 24KB (Ethereum limit)
      expect(sizeInBytes).to.be.lessThan(24576);
    });
  });
});
