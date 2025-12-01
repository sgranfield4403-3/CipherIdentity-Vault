import React, { useMemo } from 'react';
import { Typography, Steps, Card, Space } from 'antd';
import {
  WalletOutlined,
  FormOutlined,
  LockOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ICON_STYLE = { fontSize: 24 };

export const HowItWorks: React.FC = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '48px auto', padding: '0 24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
        🚀 How It Works
      </Title>

      <Steps
        direction="vertical"
        current={-1}
        items={[
          {
            title: 'Connect Wallet',
            description: 'Click "Connect Wallet" in the top right to connect your MetaMask or other Web3 wallet',
            icon: <WalletOutlined style={ICON_STYLE} />,
          },
          {
            title: 'Fill Identity Information',
            description: 'Enter your Net Worth (will be encrypted) and other identity parameters (stored as plaintext)',
            icon: <FormOutlined style={ICON_STYLE} />,
          },
          {
            title: 'FHE Encryption',
            description: 'System automatically encrypts your Net Worth data using Zama FHE technology',
            icon: <LockOutlined style={ICON_STYLE} />,
          },
          {
            title: 'On-Chain Confirmation',
            description: 'After confirming the transaction, your encrypted identity will be permanently stored on Sepolia blockchain',
            icon: <CheckCircleOutlined style={ICON_STYLE} />,
          },
        ]}
      />

      <Card
        style={{ marginTop: 48, background: '#f0f2f5', border: 'none' }}
        bodyStyle={{ padding: 32 }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>
            💡 Key Features
          </Title>
          <Paragraph style={{ margin: 0 }}>
            <strong>• Single Encrypted Parameter:</strong> Net Worth is encrypted using FHE (euint64), maintaining complete privacy
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <strong>• Plaintext Parameters:</strong> Domicile, Tier, PEP, Watchlist, Risk Score remain plaintext to save Gas
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <strong>• On-Chain Computation:</strong> Contract can compare and compute encrypted data without decryption
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <strong>• Access Control:</strong> calculateAccessLevel() function demonstrates access level evaluation based on encrypted data
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};
