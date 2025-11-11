/**
 * FHE SDK Utility for CipherIdentity Vault
 * Uses Zama Relayer SDK 0.3.0-5 loaded via CDN script tag in index.html
 */

import { bytesToHex, getAddress } from 'viem';
import type { Address } from 'viem';

// Extend Window interface to include Relayer SDK
declare global {
  interface Window {
    RelayerSDK?: any;
    relayerSDK?: any;
    ethereum?: any;
    okxwallet?: any;
  }
}

let fheInstance: any = null;

/**
 * Get the loaded Relayer SDK from window object
 */
const getSDK = () => {
  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires a browser environment');
  }
  const sdk = window.RelayerSDK || window.relayerSDK;
  if (!sdk) {
    throw new Error(
      'Relayer SDK not loaded. Please wait for the page to fully load or check your network connection.'
    );
  }
  return sdk;
};

/**
 * Check if FHE SDK is loaded and ready
 */
export const isFHEReady = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.RelayerSDK || window.relayerSDK);
};

/**
 * Check if FHE instance is initialized
 */
export const isFheInstanceReady = (): boolean => {
  return fheInstance !== null;
};

/**
 * Wait for FHE SDK to be loaded (with timeout)
 */
export const waitForFHE = async (timeoutMs: number = 10000): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (isFHEReady()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return false;
};

/**
 * Initialize FHE SDK instance
 */
export const initializeFHE = async (provider?: any): Promise<any> => {
  if (fheInstance) {
    return fheInstance;
  }

  if (typeof window === 'undefined') {
    throw new Error('FHE SDK requires a browser environment');
  }

  // Get wallet provider
  const ethereumProvider =
    provider || window.ethereum || window.okxwallet?.provider || window.okxwallet;

  if (!ethereumProvider) {
    throw new Error('No wallet provider detected. Please connect a wallet first.');
  }

  try {
    console.log('[FHE] Getting SDK from window object...');
    const sdk = getSDK();
    const { initSDK, createInstance, SepoliaConfig } = sdk;

    console.log('[FHE] Initializing WASM...');
    await initSDK();

    console.log('[FHE] Creating FHE instance with Sepolia config...');
    const config = {
      ...SepoliaConfig,
      network: ethereumProvider,
    };

    fheInstance = await createInstance(config);
    console.log('[FHE] ✅ SDK initialized successfully');

    return fheInstance;
  } catch (error: any) {
    console.error('[FHE] ❌ Failed to initialize FHE SDK:', error);
    fheInstance = null;
    throw error;
  }
};

/**
 * Get or initialize FHE instance
 */
const getInstance = async (provider?: any): Promise<any> => {
  if (fheInstance) return fheInstance;
  return initializeFHE(provider);
};

/**
 * Encrypt net worth value for identity creation/update
 * @param netWorth - The net worth value to encrypt
 * @param contractAddress - The contract address
 * @param userAddress - The user's wallet address
 * @param provider - Optional ethereum provider
 */
export const encryptNetWorth = async (
  netWorth: number,
  contractAddress: string,
  userAddress: string,
  provider?: any
): Promise<{
  handle: `0x${string}`;
  proof: `0x${string}`;
}> => {
  try {
    console.log('[FHE] Starting net worth encryption...');
    console.log('[FHE] Value:', netWorth);

    const instance = await getInstance(provider);

    // Ensure proper checksum addresses
    const contractAddr = getAddress(contractAddress as Address);
    const userAddr = getAddress(userAddress as Address);

    console.log('[FHE] Contract address:', contractAddr);
    console.log('[FHE] User address:', userAddr);

    console.log('[FHE] Creating encrypted input...');
    const input = instance.createEncryptedInput(contractAddr, userAddr);

    // Add net worth as 64-bit encrypted integer
    input.add64(BigInt(netWorth));

    console.log('[FHE] Encrypting data...');
    const { handles, inputProof } = await input.encrypt();

    if (!handles || handles.length < 1) {
      throw new Error('FHE SDK returned insufficient handles');
    }

    const handle = bytesToHex(handles[0]) as `0x${string}`;
    const proof = bytesToHex(inputProof) as `0x${string}`;

    console.log('[FHE] ✅ Encryption successful');
    console.log('[FHE] Handle:', handle.substring(0, 20) + '...');
    console.log('[FHE] Proof length:', proof.length);

    return { handle, proof };
  } catch (error: any) {
    console.error('[FHE] ❌ Encryption failed:', error);
    throw new Error(`FHE encryption failed: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Get FHE status for debugging
 */
export const getFHEStatus = (): {
  sdkLoaded: boolean;
  instanceReady: boolean;
} => {
  return {
    sdkLoaded: isFHEReady(),
    instanceReady: fheInstance !== null,
  };
};

/**
 * Get the FHE instance (for advanced usage)
 */
export const getFheInstance = async (provider?: any) => {
  return getInstance(provider);
};

/**
 * Reset FHE instance (useful for wallet disconnection)
 */
export const resetFheInstance = () => {
  fheInstance = null;
  console.log('[FHE] Instance reset');
};
