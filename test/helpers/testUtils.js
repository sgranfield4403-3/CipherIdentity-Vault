const { ethers } = require("hardhat");

/**
 * Test utility functions for FHEIdentityVault tests
 */

/**
 * Generate mock encrypted data for testing
 * In real tests, use the FHE SDK to generate proper encrypted values
 */
function generateMockEncryptedData() {
  return {
    handle: ethers.zeroPadBytes("0x" + Math.random().toString(16).slice(2, 10), 32),
    proof: "0x",
  };
}

/**
 * Create valid identity parameters
 */
function createValidIdentityParams(overrides = {}) {
  return {
    domicile: 50,
    tier: 5,
    pep: 0,
    watchlist: 0,
    riskScore: 25,
    ...overrides,
  };
}

/**
 * Create identity parameters at boundary values
 */
function createBoundaryIdentityParams() {
  return {
    min: {
      domicile: 0,
      tier: 0,
      pep: 0,
      watchlist: 0,
      riskScore: 0,
    },
    max: {
      domicile: 100,
      tier: 10,
      pep: 1,
      watchlist: 5,
      riskScore: 100,
    },
  };
}

/**
 * Create invalid identity parameters for testing validation
 */
function createInvalidIdentityParams() {
  return {
    invalidDomicile: { domicile: 101, tier: 5, pep: 0, watchlist: 0, riskScore: 25 },
    invalidTier: { domicile: 50, tier: 11, pep: 0, watchlist: 0, riskScore: 25 },
    invalidPep: { domicile: 50, tier: 5, pep: 2, watchlist: 0, riskScore: 25 },
    invalidWatchlist: { domicile: 50, tier: 5, pep: 0, watchlist: 6, riskScore: 25 },
    invalidRiskScore: { domicile: 50, tier: 5, pep: 0, watchlist: 0, riskScore: 101 },
  };
}

/**
 * Wait for transaction and return receipt
 */
async function waitForTx(tx) {
  const receipt = await tx.wait();
  return receipt;
}

/**
 * Get block timestamp
 */
async function getBlockTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

/**
 * Advance time by seconds (for testing time-dependent logic)
 */
async function advanceTime(seconds) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}

/**
 * Check if running on fhEVM compatible network
 */
function isFhevmNetwork() {
  const network = process.env.HARDHAT_NETWORK;
  return network === "sepolia" || network === "mainnet";
}

module.exports = {
  generateMockEncryptedData,
  createValidIdentityParams,
  createBoundaryIdentityParams,
  createInvalidIdentityParams,
  waitForTx,
  getBlockTimestamp,
  advanceTime,
  isFhevmNetwork,
};
