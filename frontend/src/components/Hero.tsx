import React from 'react';
import { Typography, Row, Col, Card, Space } from 'antd';
import {
  LockOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export const Hero: React.FC = () => {
  const features = [
    {
      icon: <LockOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: 'FHE Technology',
      description: 'Using Zama Fully Homomorphic Encryption, Net Worth data remains fully encrypted on-chain'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: 'Privacy Protection',
      description: 'Only you can decrypt your sensitive data, on-chain computations work without decryption'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      title: 'Decentralized',
      description: 'Fully deployed on Sepolia testnet, no need to trust any centralized servers'
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: 'Optimized',
      description: 'Only encrypts core parameters, other data remains plaintext to optimize Gas costs'
    }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 24px 60px',
      marginBottom: 48
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <Title
          level={1}
          style={{
            color: '#fff',
            fontSize: 48,
            marginBottom: 24,
            fontWeight: 700
          }}
        >
          🔐 CipherIdentity Vault
        </Title>

        <Paragraph
          style={{
            color: '#fff',
            fontSize: 20,
            marginBottom: 48,
            opacity: 0.95
          }}
        >
          On-Chain Identity Verification System Based on Zama FHE Technology
          <br />
          <Text style={{ color: '#fff', opacity: 0.8, fontSize: 16 }}>
            Keep your sensitive data encrypted on blockchain while supporting on-chain computation and verification
          </Text>
        </Paragraph>

        <Row gutter={[24, 24]} style={{ marginTop: 60 }}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space direction="vertical" size={16} style={{ width: '100%', textAlign: 'center' }}>
                  {feature.icon}
                  <Title level={4} style={{ margin: 0 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#666' }}>
                    {feature.description}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
