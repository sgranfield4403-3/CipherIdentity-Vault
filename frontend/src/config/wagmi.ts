import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'FHE Identity Vault',
  projectId: 'demo-project-id', // Replace with your WalletConnect project ID in production
  chains: [sepolia],
  ssr: false,
});

export const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';