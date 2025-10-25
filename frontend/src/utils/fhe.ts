// FHE SDK initialization utility
// Following the Zama FHE SDK CDN 0.2.0 pattern from knowledge base

import { toHex, getAddress } from 'viem';

interface FheInstance {
  createEncryptedInput: (contractAddress: string, userAddress: string) => any;
  generateKeypair: () => any;
}

let fheInstance: FheInstance | null = null;

export const initializeFHE = async (): Promise<FheInstance> => {
  if (fheInstance) {
    return fheInstance;
  }

  // Check if any Ethereum provider is available (MetaMask, OKX, etc.)
  if (typeof window === 'undefined') {
    throw new Error('Window object not available');
  }

  // Support multiple wallet providers
  const provider = (window as any).okxwallet?.provider || (window as any).ethereum;

  if (!provider) {
    throw new Error('Ethereum provider not found. Please install MetaMask, OKX Wallet or connect your wallet.');
  }

  try {
    console.log('[FHE] Loading SDK from Zama CDN 0.2.0...');
    // Dynamic import of FHE SDK from CDN
    const sdk = await import('https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js' as any);
    const { initSDK, createInstance, SepoliaConfig } = sdk as any;

    console.log('[FHE] Initializing WASM...');
    // Initialize SDK
    await initSDK();

    console.log('[FHE] Creating instance with network provider...');
    // Create FHE instance with Sepolia config
    const instance = await createInstance({
      ...SepoliaConfig,
      network: provider,
      gatewayUrl: 'https://gateway.zama.ai'
    });

    fheInstance = instance as FheInstance;

    console.log('[FHE] ✅ SDK initialized successfully');
    return fheInstance;
  } catch (error) {
    console.error('[FHE] ❌ Failed to initialize FHE SDK:', error);
    fheInstance = null;
    throw error;
  }
};

export const encryptNetWorth = async (
  netWorth: number,
  contractAddress: string,
  userAddress: string
): Promise<{
  handle: string;
  proof: string;
}> => {
  try {
    console.log('[FHE] Starting net worth encryption...');
    const fhe = await initializeFHE();

    // Use getAddress to ensure checksum format
    const contractAddressChecksum = getAddress(contractAddress);
    console.log('[FHE] Contract address:', contractAddressChecksum);
    console.log('[FHE] User address:', userAddress);

    console.log('[FHE] Creating encrypted input...');
    // Create encrypted input using correct FHE pattern from knowledge base
    const input = fhe.createEncryptedInput(contractAddressChecksum, userAddress);

    console.log('[FHE] Adding net worth value:', netWorth);
    // Add the net worth value as 64-bit encrypted integer
    input.add64(BigInt(netWorth));

    console.log('[FHE] Encrypting data...');
    // Encrypt and get handles + proof
    const encryptedData = await input.encrypt();

    // Convert to hex strings using toHex from viem
    const handle = toHex(encryptedData.handles[0]);
    const proof = toHex(encryptedData.inputProof);

    console.log('[FHE] ✅ Encryption successful');
    console.log('[FHE] Handle:', handle.substring(0, 20) + '...');
    console.log('[FHE] Proof:', proof.substring(0, 20) + '...');

    return {
      handle,
      proof
    };
  } catch (error: any) {
    console.error('[FHE] ❌ Encryption failed:', error);
    throw new Error(`FHE encryption failed: ${error?.message || 'Unknown error'}`);
  }
};

export const getFheInstance = async () => {
  if (!fheInstance) {
    await initializeFHE();
  }
  return fheInstance;
};