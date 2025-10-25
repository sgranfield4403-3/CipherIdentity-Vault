# CipherIdentity Vault

On-chain identity verification using Zama's Fully Homomorphic Encryption. Store sensitive data encrypted on the blockchain while keeping it computationally accessible.

**Live Demo**: https://cipherid.vercel.app
**Contract**: [0x1260789F4C939FDf7a0F5c30c4b90FB4aF161753](https://sepolia.etherscan.io/address/0x1260789F4C939FDf7a0F5c30c4b90FB4aF161753)
**Demo Video**: [Download](./demo.mp4)

## Why This Matters

Traditional blockchain apps force you to choose: either your data is public, or you can't do anything useful with it. FHE changes that. Your net worth stays encrypted on-chain, but smart contracts can still compute with it to determine your access level, verify eligibility, or calculate scores.

## What's Different Here

Most FHE demos encrypt everything. We don't. Only net worth gets encrypted because that's what actually needs privacy. Everything else (domicile, tier, risk scores) stays plaintext. This cuts gas costs by ~66% while protecting what matters.

## Architecture

```
Frontend (React + Zama SDK 0.2.0)
         ↓
   Encrypt net worth locally
         ↓
Smart Contract (Sepolia)
         ↓
   Store encrypted euint64
   Compute without decryption
```

## Smart Contract

**File**: `contracts/src/FHEIdentityVault.sol`

The contract stores one encrypted field (net worth) and five plaintext fields (domicile, tier, PEP status, watchlist, risk score). Here's the core function:

```solidity
function createIdentity(
    externalEuint64 encryptedNetWorth,
    bytes calldata proof,
    uint32 domicile,
    uint16 tier,
    uint8 pep,
    uint8 watchlist,
    uint8 riskScore
) external {
    require(!identities[msg.sender].exists, "Identity exists");

    // Convert external encrypted input with proof verification
    euint64 netWorth = FHE.fromExternal(encryptedNetWorth, proof);

    identities[msg.sender] = Identity({
        owner: msg.sender,
        encryptedNetWorth: netWorth,
        domicile: domicile,
        tier: tier,
        pep: pep,
        watchlist: watchlist,
        riskScore: riskScore,
        createdAt: uint64(block.timestamp),
        updatedAt: uint64(block.timestamp),
        exists: true
    });

    FHE.allow(netWorth, msg.sender);
    FHE.allowThis(netWorth);
}
```

The contract also includes `calculateAccessLevel()` which demonstrates on-chain computation on encrypted data:

```solidity
function calculateAccessLevel() external returns (euint8) {
    Identity storage identity = identities[msg.sender];

    // Compare encrypted net worth against thresholds
    ebool isHighNetWorth = FHE.gt(identity.encryptedNetWorth, FHE.asEuint64(1000000));
    ebool isMediumNetWorth = FHE.gt(identity.encryptedNetWorth, FHE.asEuint64(100000));

    // Combine with plaintext criteria
    if (identity.pep == 1 || identity.watchlist >= 3) {
        return FHE.asEuint8(0); // Denied
    }

    // Return encrypted access level based on net worth
    return FHE.select(isHighNetWorth, FHE.asEuint8(3),
           FHE.select(isMediumNetWorth, FHE.asEuint8(2), FHE.asEuint8(1)));
}
```

## Frontend

Built with React 18, TypeScript, Ant Design 5, wagmi v2, and viem v2.

The key piece is `utils/fhe.ts`:

```typescript
export const encryptNetWorth = async (
  netWorth: number,
  contractAddress: string,
  userAddress: string
): Promise<{ handle: string; proof: string }> => {
  const fhe = await initializeFHE();

  // Create encrypted input for specific contract
  const input = fhe.createEncryptedInput(
    getAddress(contractAddress),
    userAddress
  );

  // Add 64-bit value
  input.add64(BigInt(netWorth));

  // Encrypt and generate proof
  const { handles, inputProof } = await input.encrypt();

  return {
    handle: toHex(handles[0]),
    proof: toHex(inputProof)
  };
};
```

Then in the form component:

```typescript
const handleSubmit = async (values: any) => {
  // Step 1: Encrypt locally
  const { handle, proof } = await encryptNetWorth(
    values.netWorth,
    contractConfig.address,
    address
  );

  // Step 2: Send to contract
  const hash = await writeContractAsync({
    ...contractConfig,
    functionName: 'createIdentity',
    args: [handle, proof, values.domicile, values.tier,
           values.pep, values.watchlist, values.riskScore],
  });

  // Step 3: Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
};
```

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173, connect your wallet (Sepolia testnet), and create an identity.

## Project Structure

```
CipherIdentity-Vault/
├── contracts/
│   ├── src/FHEIdentityVault.sol
│   └── FHEIdentityVault.json
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
│   │   │   └── fhe.ts
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Tech Stack

**Contracts**: Solidity 0.8.24, Zama fhEVM, Hardhat
**Frontend**: React 18, TypeScript, Vite, Ant Design 5, wagmi v2, viem v2, RainbowKit, Zama FHE SDK 0.2.0
**Network**: Ethereum Sepolia

## Security Notes

**What's encrypted**: Net worth (euint64)
**What's plaintext**: Domicile, tier, PEP status, watchlist score, risk score

The plaintext fields are intentionally public to reduce gas costs. Only net worth remains private and computationally accessible via FHE operations.

**Access control**: Each user can only update their own identity. FHE permissions are set so only the owner can authorize decryption of their net worth.

## Gas Costs

| Approach | Approximate Gas |
|----------|-----------------|
| 1 encrypted + 5 plaintext fields | ~400K |
| 6 encrypted fields | ~1.2M |
| **Savings** | **66%** |

## Demo Video

Watch a complete walkthrough of the CipherIdentity Vault:

[![Demo Video](https://img.shields.io/badge/Watch-Demo%20Video-blue?style=for-the-badge&logo=video)](./demo.mp4)

[📥 Download Demo Video](./demo.mp4)

## Links

- Zama Docs: https://docs.zama.ai
- fhEVM: https://docs.zama.ai/fhevm
- Contract: https://sepolia.etherscan.io/address/0x1260789F4C939FDf7a0F5c30c4b90FB4aF161753

## License

MIT
