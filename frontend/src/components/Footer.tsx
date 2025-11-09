import React from 'react';
import { Typography, Space, Divider, Row, Col, Tag } from 'antd';
import { GithubOutlined, LinkOutlined, SafetyOutlined } from '@ant-design/icons';
import { CONTRACT_ADDRESS } from '../config/contract';

const { Text, Link } = Typography;

// Version constants
const VERSIONS = {
  fhevm: '0.9.1',
  relayerSdk: '0.3.0-5',
  react: '18.3.1',
  typescript: '5.6.2',
  antd: '5.27.5',
  wagmi: '2.18.1',
  viem: '2.38.3',
  solidity: '0.8.24',
};

export const Footer: React.FC = () => {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #001529 100%)',
        color: '#fff',
        padding: '48px 24px 24px',
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Links Section */}
        <Row gutter={[48, 32]} justify="center">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size={12}>
              <Text strong style={{ color: '#fff', fontSize: 14 }}>
                Documentation
              </Text>
              <Link
                href="https://docs.zama.ai"
                target="_blank"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <LinkOutlined /> Zama Docs
              </Link>
              <Link
                href="https://docs.zama.ai/fhevm"
                target="_blank"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <LinkOutlined /> fhEVM Guide
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size={12}>
              <Text strong style={{ color: '#fff', fontSize: 14 }}>
                Resources
              </Text>
              <Link
                href="https://github.com/zama-ai"
                target="_blank"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <GithubOutlined /> Zama GitHub
              </Link>
              <Link
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                <LinkOutlined /> View Contract
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size={12}>
              <Text strong style={{ color: '#fff', fontSize: 14 }}>
                Network
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)' }}>
                <SafetyOutlined /> Ethereum Sepolia
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)' }}>Chain ID: 11155111</Text>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '32px 0' }} />

        {/* Contract Info */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            Contract Address:{' '}
            <Link
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              style={{ color: '#60a5fa', fontFamily: 'monospace' }}
            >
              {truncateAddress(CONTRACT_ADDRESS)}
            </Link>
          </Text>
        </div>

        {/* Tech Stack Versions */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Space size={[8, 8]} wrap style={{ justifyContent: 'center' }}>
            <Tag color="blue">fhEVM {VERSIONS.fhevm}</Tag>
            <Tag color="purple">Relayer SDK {VERSIONS.relayerSdk}</Tag>
            <Tag color="cyan">React {VERSIONS.react}</Tag>
            <Tag color="orange">TypeScript {VERSIONS.typescript}</Tag>
            <Tag color="geekblue">wagmi {VERSIONS.wagmi}</Tag>
            <Tag color="green">viem {VERSIONS.viem}</Tag>
            <Tag color="volcano">Solidity {VERSIONS.solidity}</Tag>
            <Tag color="magenta">Ant Design {VERSIONS.antd}</Tag>
          </Space>
        </div>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '24px 0' }} />

        {/* Copyright */}
        <Text
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 12,
            display: 'block',
            textAlign: 'center',
          }}
        >
          © 2025 CipherIdentity Vault. Built with Zama FHE Technology.
        </Text>
      </div>
    </div>
  );
};
