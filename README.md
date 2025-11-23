# CipherIdentity Vault

<div align="center">

![Zama](https://img.shields.io/badge/Zama-fhEVM%200.9.1-blue?style=for-the-badge)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Privacy-Preserving On-Chain Identity Verification with Fully Homomorphic Encryption**

[Live Demo](https://cipheridentity-vault.vercel.app) • [Smart Contract](https://sepolia.etherscan.io/address/0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A) • [Documentation](#documentation)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Smart Contract](#smart-contract)
- [FHE Mechanism](#fhe-mechanism)
- [Business Logic](#business-logic)
- [Installation](#installation)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## Overview

CipherIdentity Vault is a decentralized identity verification system that leverages **Zama's Fully Homomorphic Encryption (FHE)** technology to store and compute on sensitive financial data without ever exposing it. Unlike traditional blockchain applications where data is either public or unusable, FHE enables computations on encrypted data while maintaining complete privacy.

### The Problem

Traditional blockchain identity systems face a fundamental tradeoff:
- **Public Data**: Anyone can see sensitive information (net worth, financial status)
- **Private Data**: Encrypted data cannot be used for on-chain computations

### Our Solution

CipherIdentity Vault uses FHE to encrypt sensitive net worth data while allowing smart contracts to perform computations (comparisons, access level calculations) without decryption. The result is encrypted but can be authorized for viewing only by the data owner.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Encrypted Net Worth** | Financial data stored as `euint64` - encrypted on-chain |
| **On-Chain Computation** | Calculate access levels, verify thresholds without decryption |
| **Gas Optimized** | Selective encryption (1 encrypted + 5 plaintext) saves ~66% gas |
| **Owner-Only Access** | FHE permissions ensure only owners can decrypt their data |
| **Modern UI** | React 18 + Ant Design 5 with dark theme |
| **Multi-Wallet Support** | MetaMask, WalletConnect, Coinbase Wallet via RainbowKit |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User's Browser                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│   │   React UI  │───▶│  Zama Relayer    │───▶│  Wallet Provider │  │
│   │  (Ant Design)│   │   SDK 0.3.0-5    │    │   (MetaMask)     │  │
│   └─────────────┘    └──────────────────┘    └──────────────────┘  │
│          │                    │                       │             │
│          │         ┌──────────┴──────────┐           │             │
│          │         │                     │           │             │
│          ▼         ▼                     ▼           ▼             │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                    Encryption Layer                          │  │
│   │  • createEncryptedInput(contractAddr, userAddr)             │  │
│   │  • input.add64(netWorth) → encrypt() → {handles, inputProof}│  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                │                                    │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Ethereum Sepolia Network                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │              FHEIdentityVault Smart Contract                 │  │
│   │              0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A     │  │
│   ├─────────────────────────────────────────────────────────────┤  │
│   │                                                              │  │
│   │  Identity Storage:                                          │  │
│   │  ┌─────────────────────────────────────────────────────┐   │  │
│   │  │ encryptedNetWorth: euint64  ← FHE Encrypted         │   │  │
│   │  │ domicile: uint32            ← Plaintext             │   │  │
│   │  │ tier: uint16                ← Plaintext             │   │  │
│   │  │ pep: uint8                  ← Plaintext             │   │  │
│   │  │ watchlist: uint8            ← Plaintext             │   │  │
│   │  │ riskScore: uint8            ← Plaintext             │   │  │
│   │  └─────────────────────────────────────────────────────┘   │  │
│   │                                                              │  │
│   │  FHE Operations:                                            │  │
│   │  • FHE.fromExternal() - Verify and import encrypted input  │  │
│   │  • FHE.gt() / FHE.ge() - Encrypted comparisons             │  │
│   │  • FHE.select() - Conditional selection on encrypted data  │  │
│   │  • FHE.allow() - Grant decryption permission               │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                   Zama Coprocessor Network                   │  │
│   │           (FHE Key Management & Computation)                │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Smart Contracts

| Package | Version | Purpose |
|---------|---------|---------|
| `@fhevm/solidity` | ^0.9.1 | Zama FHE library for Solidity |
| `hardhat` | ^2.22.0 | Development framework |
| `@nomicfoundation/hardhat-toolbox` | ^5.0.0 | Hardhat utilities |
| `@nomicfoundation/hardhat-chai-matchers` | ^2.0.8 | Test assertions |
| `ethers` | ^6.13.5 | Ethereum library |
| Solidity | 0.8.24 | Smart contract language |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `typescript` | ~5.6.2 | Type safety |
| `vite` | ^6.0.7 | Build tool |
| `antd` | ^5.27.5 | UI component library |
| `wagmi` | ^2.18.1 | React hooks for Ethereum |
| `viem` | ^2.38.3 | Ethereum primitives |
| `@rainbow-me/rainbowkit` | ^2.2.0 | Wallet connection |
| `@tanstack/react-query` | ^5.80.1 | Data fetching |
| Zama Relayer SDK | 0.3.0-5 | FHE client-side encryption |

### Network

- **Chain**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: Public Sepolia RPC endpoints

---

## Smart Contract

### Contract Address

```
Sepolia: 0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A
```

### Core Data Structure

```solidity
struct Identity {
    address owner;              // Identity owner
    euint64 encryptedNetWorth;  // FHE-encrypted net worth
    uint32 domicile;            // Country code (e.g., 840 for USA)
    uint16 tier;                // Membership tier (1-5)
    uint8 pep;                  // Politically Exposed Person (0/1)
    uint8 watchlist;            // Watchlist score (0-5)
    uint8 riskScore;            // Risk assessment (0-100)
    uint64 createdAt;           // Creation timestamp
    uint64 updatedAt;           // Last update timestamp
    bool exists;                // Existence flag
}
```

### Key Functions

| Function | Description | Access |
|----------|-------------|--------|
| `createIdentity()` | Create new identity with encrypted net worth | Public |
| `updateIdentity()` | Update existing identity | Owner only |
| `getIdentity()` | Retrieve identity data (encrypted net worth returned) | Public |
| `calculateAccessLevel()` | Compute access level based on encrypted criteria | Owner only |
| `hasHighNetWorth()` | Check if net worth exceeds threshold (returns encrypted bool) | Owner only |

### FHE Operations in Contract

```solidity
// Import encrypted data with proof verification
euint64 netWorth = FHE.fromExternal(encryptedNetWorth, proof);

// Grant permissions
FHE.allow(netWorth, msg.sender);  // Owner can decrypt
FHE.allowThis(netWorth);           // Contract can compute

// Encrypted comparisons
ebool isHighNetWorth = FHE.gt(identity.encryptedNetWorth, FHE.asEuint64(1000000));

// Conditional selection on encrypted data
euint8 accessLevel = FHE.select(
    isHighNetWorth,
    FHE.asEuint8(3),  // High access
    FHE.asEuint8(1)   // Standard access
);
```

---

## FHE Mechanism

### How Encryption Works

1. **Client-Side Encryption**: The Zama Relayer SDK encrypts sensitive data in the browser
2. **Proof Generation**: A cryptographic proof is generated to verify the encryption
3. **On-Chain Storage**: Encrypted data (`euint64`) and proof are sent to the contract
4. **Verification**: `FHE.fromExternal()` verifies the proof and imports the encrypted value
5. **Computation**: FHE operations compute on encrypted data without decryption
6. **Access Control**: `FHE.allow()` grants specific addresses permission to decrypt

### SDK Loading (Browser)

The Zama Relayer SDK is loaded via script tag for optimal compatibility:

```html
<!-- index.html -->
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
<meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />

<script
  src="https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs"
  defer
  crossorigin="anonymous"
></script>
```

### Encryption Flow

```typescript
// 1. Initialize SDK
const sdk = window.RelayerSDK;
await sdk.initSDK();
const instance = await sdk.createInstance({
  ...sdk.SepoliaConfig,
  network: ethereumProvider,
});

// 2. Create encrypted input
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add64(BigInt(netWorth));

// 3. Encrypt and get proof
const { handles, inputProof } = await input.encrypt();

// 4. Send to contract
await contract.createIdentity(handles[0], inputProof, ...otherArgs);
```

---

## Business Logic

### Identity Creation Flow

```
User Input          Encryption          Transaction          Storage
    │                   │                    │                  │
    ▼                   ▼                    ▼                  ▼
┌─────────┐      ┌───────────┐       ┌──────────────┐    ┌──────────┐
│Net Worth│─────▶│FHE Encrypt│──────▶│createIdentity│───▶│euint64   │
│$500,000 │      │+ Proof Gen│       │Transaction   │    │encrypted │
└─────────┘      └───────────┘       └──────────────┘    └──────────┘
    │                                                          │
    ▼                                                          ▼
┌─────────┐                                              ┌──────────┐
│Plaintext│─────────────────────────────────────────────▶│uint32/16 │
│Fields   │                                              │/8 stored │
└─────────┘                                              └──────────┘
```

### Access Level Calculation

The contract computes access levels without exposing net worth:

| Net Worth Range | Access Level | Permissions |
|-----------------|--------------|-------------|
| > $1,000,000 | Level 3 (Premium) | Full access, priority support |
| > $100,000 | Level 2 (Standard) | Standard features |
| ≤ $100,000 | Level 1 (Basic) | Limited features |
| PEP or Watchlist ≥ 3 | Level 0 (Denied) | No access |

### Gas Optimization Strategy

| Field | Encryption | Gas Cost | Rationale |
|-------|------------|----------|-----------|
| Net Worth | Yes (euint64) | ~300K | Highly sensitive financial data |
| Domicile | No (uint32) | ~5K | Public geographic info |
| Tier | No (uint16) | ~5K | Service level indicator |
| PEP | No (uint8) | ~5K | Compliance flag |
| Watchlist | No (uint8) | ~5K | Risk indicator |
| Risk Score | No (uint8) | ~5K | Computed score |

**Total Savings**: ~66% gas reduction by encrypting only sensitive data

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([Faucet](https://sepoliafaucet.com))

### Clone Repository

```bash
git clone https://github.com/your-username/CipherIdentity-Vault.git
cd CipherIdentity-Vault
```

### Install Contract Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Environment Setup

Create `.env` file in root directory:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
```

Create `.env` file in `frontend/` directory:

```env
VITE_CONTRACT_ADDRESS=0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A
VITE_CHAIN_ID=11155111
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Run Frontend Locally

```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Testing

### Test Suite Overview

The project includes comprehensive tests covering:

- **Unit Tests**: 15 tests for contract functionality
- **Integration Tests**: 5 tests for Sepolia network (skipped on local)
- **Gas Estimation Tests**: 4 tests for gas cost analysis

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run gas estimation tests
npm run test:gas

# Run integration tests (requires Sepolia connection)
npm run test:integration
```

### Test Structure

```
test/
├── FHEIdentityVault.test.js         # Unit tests (15 tests)
├── FHEIdentityVault.integration.test.js  # Integration tests (5 tests)
├── gas-estimation.test.js           # Gas cost tests (4 tests)
└── helpers/
    └── testUtils.js                 # Test utilities
```

### Sample Test Output

```
  FHEIdentityVault Unit Tests
    Deployment
      ✓ Should deploy successfully
      ✓ Should have correct contract owner
    Input Validation
      ✓ Should reject domicile code 0
      ✓ Should reject tier value 0
      ✓ Should reject risk score > 100
      ✓ Should reject watchlist score > 5
    Identity Lifecycle
      ✓ Should prevent duplicate identity creation
      ✓ Should prevent updates to non-existent identity
    Access Control
      ✓ Should only allow owner to calculate access level

  Gas Estimation Tests
    ✓ Deployment gas: ~1,093,000
    ✓ Read operations: ~23,000
    ✓ Contract size: 4.35 KB

  19 passing (2s)
```

---

## Deployment

### Deploy to Sepolia

```bash
# Compile contracts
npx hardhat compile

# Deploy
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/deploy.cjs --network sepolia
```

### Deploy Frontend to Vercel

```bash
cd frontend
npm run build

# Deploy with Vercel CLI
VERCEL_TOKEN="your_token" vercel --prod --yes
```

### Current Deployments

| Resource | URL |
|----------|-----|
| Live Demo | https://cipheridentity-vault.vercel.app |
| Contract (Sepolia) | [0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A](https://sepolia.etherscan.io/address/0xDD6CeBe2030AE48274f9C62DB4b1EC1CE273F30A) |

---

## API Reference

### Frontend Utilities

#### `encryptNetWorth(netWorth, contractAddress, userAddress, provider?)`

Encrypts a net worth value for submission to the contract.

```typescript
const { handle, proof } = await encryptNetWorth(
  500000,                    // Net worth in dollars
  '0xDD6Ce...',              // Contract address
  '0xUser...',               // User's wallet address
  window.ethereum            // Optional provider
);
```

**Returns**: `{ handle: 0x${string}, proof: 0x${string} }`

#### `initializeFHE(provider?)`

Initializes the FHE SDK instance.

```typescript
const fheInstance = await initializeFHE(window.ethereum);
```

#### `isFHEReady()`

Checks if the FHE SDK is loaded.

```typescript
if (isFHEReady()) {
  // SDK is available
}
```

#### `waitForFHE(timeoutMs?)`

Waits for the FHE SDK to load with timeout.

```typescript
const isReady = await waitForFHE(10000); // 10 second timeout
```

### Toast Notifications

```typescript
import { showTxSubmitted, showTxSuccess, showTxFailed } from './utils/toast';

// Transaction submitted
showTxSubmitted(txHash);

// Transaction confirmed
showTxSuccess(txHash, 'Identity Created');

// Transaction failed
showTxFailed(txHash, 'Transaction reverted');
```

---

## Security Considerations

### Data Classification

| Data Type | Encryption | Visibility | Rationale |
|-----------|------------|------------|-----------|
| Net Worth | FHE (euint64) | Private | Sensitive financial information |
| Domicile | None (uint32) | Public | Geographic regulatory compliance |
| Tier | None (uint16) | Public | Service level indicator |
| PEP Status | None (uint8) | Public | Regulatory compliance flag |
| Watchlist | None (uint8) | Public | Risk indicator |
| Risk Score | None (uint8) | Public | Computed compliance metric |

### Access Control

1. **Identity Ownership**: Only the identity owner can update their data
2. **FHE Permissions**: `FHE.allow()` restricts decryption to authorized addresses
3. **Proof Verification**: `FHE.fromExternal()` validates encryption proofs

### Browser Security

The FHE SDK requires specific security headers for SharedArrayBuffer:

```html
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
<meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />
```

### Best Practices

- Never expose private keys in frontend code
- Use environment variables for sensitive configuration
- Validate all user inputs before encryption
- Test thoroughly on testnet before mainnet deployment

---

## Project Structure

```
CipherIdentity-Vault/
├── contracts/
│   ├── src/
│   │   └── FHEIdentityVault.sol    # Main FHE contract
│   └── FHEIdentityVault.json       # Contract ABI
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateIdentityForm.tsx
│   │   │   ├── ViewIdentity.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── Footer.tsx
│   │   ├── config/
│   │   │   ├── contract.ts
│   │   │   └── wagmi.ts
│   │   ├── utils/
│   │   │   ├── fhe.ts              # FHE SDK utilities
│   │   │   └── toast.tsx           # Toast notifications
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── scripts/
│   └── deploy.cjs                   # Deployment script
├── test/
│   ├── FHEIdentityVault.test.js
│   ├── FHEIdentityVault.integration.test.js
│   ├── gas-estimation.test.js
│   └── helpers/
│       └── testUtils.js
├── hardhat.config.js
├── package.json
└── README.md
```

---

## Resources

- [Zama Documentation](https://docs.zama.ai)
- [fhEVM Documentation](https://docs.zama.ai/fhevm)
- [fhEVM 0.9.1 Migration Guide](https://docs.zama.org/protocol/solidity-guides/development-guide/migration)
- [Sepolia Testnet Faucet](https://sepoliafaucet.com)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with Zama FHE Technology**

[Report Bug](https://github.com/your-username/CipherIdentity-Vault/issues) • [Request Feature](https://github.com/your-username/CipherIdentity-Vault/issues)

</div>
