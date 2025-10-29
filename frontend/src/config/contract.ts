// Contract configuration
import contractArtifact from '../contracts/FHEIdentityVault.json';

export const CONTRACT_ADDRESS = '0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A'; // Deployed on Sepolia (fhEVM 0.9.1)

export const CONTRACT_ABI = contractArtifact.abi;

export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI,
} as const;