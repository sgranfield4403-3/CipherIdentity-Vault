import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// App configuration constants
export const APP_NAME = 'CipherIdentity Vault';
export const WALLET_CONNECT_PROJECT_ID = 'demo-project-id'; // Replace with your WalletConnect project ID in production

export const wagmiConfig = getDefaultConfig({
  appName: APP_NAME,
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia],
  ssr: false,
});

// RPC endpoints
export const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
export const SEPOLIA_CHAIN_ID = 11155111;