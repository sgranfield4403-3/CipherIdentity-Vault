// Contract configuration
import contractArtifact from '../contracts/FHEIdentityVault.json';

export const CONTRACT_ADDRESS = '0x1260789F4C939FDf7a0F5c30c4b90FB4aF161753'; // Deployed on Sepolia

export const CONTRACT_ABI = contractArtifact.abi;

export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI,
} as const;