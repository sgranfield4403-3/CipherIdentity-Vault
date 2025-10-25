import React from 'react';
import { Typography, Space, Divider } from 'antd';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

export const Footer: React.FC = () => {
  return (
    <div
      style={{
        background: '#001529',
        color: '#fff',
        padding: '48px 24px 24px',
        marginTop: 80
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space size={24} wrap>
            <Link
              href="https://docs.zama.ai"
              target="_blank"
              style={{ color: '#fff' }}
            >
              <LinkOutlined /> Zama Docs
            </Link>
            <Link
              href="https://github.com/zama-ai"
              target="_blank"
              style={{ color: '#fff' }}
            >
              <GithubOutlined /> GitHub
            </Link>
            <Link
              href={`https://sepolia.etherscan.io/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`}
              target="_blank"
              style={{ color: '#fff' }}
            >
              <LinkOutlined /> View Contract
            </Link>
          </Space>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '24px 0' }} />

          <Space direction="vertical" size={8}>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
              Contract Address: {import.meta.env.VITE_CONTRACT_ADDRESS}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
              Network: Sepolia Testnet
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
              Tech Stack: React + TypeScript + Ant Design + Zama FHE SDK 0.2.0
            </Text>
          </Space>

          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
            © 2025 CipherIdentity Vault. Powered by Zama FHE Technology.
          </Text>
        </Space>
      </div>
    </div>
  );
};
