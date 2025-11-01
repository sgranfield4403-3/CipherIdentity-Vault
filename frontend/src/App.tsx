import React, { useEffect, useState } from 'react';
import { Layout, Typography, Space, Spin, ConfigProvider, theme } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { CreateIdentityForm } from './components/CreateIdentityForm';
import { IdentityDashboard } from './components/IdentityDashboard';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { contractConfig } from './config/contract';
import { SafetyOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Ant Design theme configuration
const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#2563EB',
    colorInfo: '#2563EB',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorBgLayout: '#F7F9FC',
    colorBgContainer: '#FFFFFF',
    colorTextBase: '#0F172A',
    colorBorder: '#E5E7EB',
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    borderRadius: 8,
  },
};

function App() {
  const { address, isConnected } = useAccount();
  const [hasIdentity, setHasIdentity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has identity
  const { data: identityExists, refetch: refetchIdentity } = useReadContract({
    ...contractConfig,
    functionName: 'hasIdentity',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (typeof identityExists === 'boolean') {
      setHasIdentity(identityExists);
      setIsLoading(false);
    } else if (!isConnected) {
      setIsLoading(false);
    }
  }, [identityExists, isConnected]);

  const handleIdentityCreated = () => {
    setHasIdentity(true);
    refetchIdentity();
  };

  return (
    <ConfigProvider theme={lightTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Space align="center">
            <SafetyOutlined style={{ fontSize: 24, color: '#2563EB' }} />
            <Title level={3} style={{ margin: 0, color: '#0F172A' }}>
              FHE Identity Vault
            </Title>
          </Space>

          <ConnectButton />
        </Header>

        <Content style={{ padding: 0, background: '#F7F9FC' }}>
          {/* Hero Section */}
          {!isConnected && <Hero />}

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
            {/* Main Content */}
            {!isConnected ? (
              <HowItWorks />
            ) : isLoading ? (
              <div
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: '64px 32px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
                }}
              >
                <Spin size="large" />
                <Title level={4} style={{ marginTop: 24 }}>
                  Loading identity data...
                </Title>
              </div>
            ) : hasIdentity ? (
              <IdentityDashboard />
            ) : (
              <CreateIdentityForm onSuccess={handleIdentityCreated} />
            )}
          </div>

          <Footer />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
