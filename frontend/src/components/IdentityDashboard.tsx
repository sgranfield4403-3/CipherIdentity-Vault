import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Space,
  Typography,
  Statistic,
  Divider,
  Spin,
  Alert,
  Progress,
  Button,
  Tooltip,
  Badge,
} from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  CrownOutlined,
  SafetyOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  LockOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useAccount, useReadContract } from 'wagmi';
import { contractConfig, CONTRACT_ADDRESS } from '../config/contract';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text, Link } = Typography;

interface PlaintextData {
  domicile: number;
  tier: number;
  pep: number;
  watchlist: number;
  riskScore: number;
  createdAt: bigint;
  updatedAt: bigint;
}

// Country code mapping (ISO 3166-1 numeric)
const COUNTRY_NAMES: Record<number, string> = {
  1: 'United States',
  44: 'United Kingdom',
  81: 'Japan',
  82: 'South Korea',
  86: 'China',
  91: 'India',
  49: 'Germany',
  33: 'France',
  39: 'Italy',
  34: 'Spain',
  61: 'Australia',
  65: 'Singapore',
  852: 'Hong Kong',
  971: 'UAE',
  41: 'Switzerland',
};

// Tier names
const TIER_NAMES: Record<number, { name: string; color: string }> = {
  1: { name: 'Bronze', color: '#CD7F32' },
  2: { name: 'Silver', color: '#C0C0C0' },
  3: { name: 'Gold', color: '#FFD700' },
  4: { name: 'Platinum', color: '#E5E4E2' },
  5: { name: 'Diamond', color: '#B9F2FF' },
};

export const IdentityDashboard: React.FC = () => {
  const { address } = useAccount();
  const [identityData, setIdentityData] = useState<PlaintextData | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useReadContract({
    ...contractConfig,
    functionName: 'getPlaintextData',
    args: address ? [address] : undefined,
  });

  // Get total identities count
  const { data: totalIdentities } = useReadContract({
    ...contractConfig,
    functionName: 'totalIdentities',
  });

  useEffect(() => {
    if (data) {
      const [domicile, tier, pep, watchlist, riskScore, createdAt, updatedAt] = data as any;
      setIdentityData({
        domicile: Number(domicile),
        tier: Number(tier),
        pep: Number(pep),
        watchlist: Number(watchlist),
        riskScore: Number(riskScore),
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    }
  }, [data]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 24, color: '#64748b' }}>
          Loading identity data from blockchain...
        </Title>
      </Card>
    );
  }

  if (isError || !identityData) {
    return (
      <Card>
        <Alert
          message="Error Loading Identity"
          description="Failed to load identity data. Please check your connection and try again."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  const getRiskLevel = (score: number) => {
    if (score <= 20) return { level: 'Very Low', color: '#22c55e' };
    if (score <= 40) return { level: 'Low', color: '#84cc16' };
    if (score <= 60) return { level: 'Medium', color: '#eab308' };
    if (score <= 80) return { level: 'High', color: '#f97316' };
    return { level: 'Critical', color: '#ef4444' };
  };

  const getWatchlistInfo = (level: number) => {
    const info = [
      { status: 'Clear', color: 'green', icon: <CheckCircleOutlined /> },
      { status: 'Monitoring', color: 'blue', icon: <ExclamationCircleOutlined /> },
      { status: 'Low Risk', color: 'gold', icon: <WarningOutlined /> },
      { status: 'Elevated', color: 'orange', icon: <WarningOutlined /> },
      { status: 'High Risk', color: 'red', icon: <ExclamationCircleOutlined /> },
      { status: 'Critical', color: 'red', icon: <ExclamationCircleOutlined /> },
    ];
    return info[level] || info[0];
  };

  const riskInfo = getRiskLevel(identityData.riskScore);
  const watchlistInfo = getWatchlistInfo(identityData.watchlist);
  const tierInfo = TIER_NAMES[identityData.tier] || { name: `Tier ${identityData.tier}`, color: '#6b7280' };
  const countryName = COUNTRY_NAMES[identityData.domicile] || `Code: ${identityData.domicile}`;

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header Card */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
          border: 'none',
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Space>
                <Badge status="success" />
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                  Identity Verified
                </Text>
              </Space>
              <Title level={3} style={{ color: '#fff', margin: 0 }}>
                <UserOutlined style={{ marginRight: 12 }} />
                {truncateAddress(address || '')}
              </Title>
              <Link
                href={`https://sepolia.etherscan.io/address/${address}`}
                target="_blank"
                style={{ color: '#60a5fa', fontSize: 13 }}
              >
                <LinkOutlined /> View on Etherscan
              </Link>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" align="end" size={4}>
              <Tag
                style={{
                  background: tierInfo.color,
                  color: identityData.tier >= 3 ? '#000' : '#fff',
                  border: 'none',
                  fontSize: 14,
                  padding: '4px 16px',
                }}
              >
                <CrownOutlined /> {tierInfo.name} Member
              </Tag>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                {totalIdentities ? `#${Number(totalIdentities)} registered` : ''}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Main Stats Grid */}
      <Row gutter={[16, 16]}>
        {/* Net Worth - Encrypted */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              height: '100%',
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <LockOutlined style={{ color: '#fff' }} />
                <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Net Worth</Text>
              </Space>
              <Title level={2} style={{ color: '#fff', margin: '8px 0' }}>
                ENCRYPTED
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                Protected by FHE • Only you can decrypt
              </Text>
            </Space>
          </Card>
        </Col>

        {/* Domicile */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title={
                <Space>
                  <GlobalOutlined style={{ color: '#2563eb' }} />
                  <span>Domicile</span>
                </Space>
              }
              value={countryName}
              valueStyle={{ fontSize: 20, color: '#0f172a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Country Code: {identityData.domicile}
            </Text>
          </Card>
        </Col>

        {/* Tier */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title={
                <Space>
                  <CrownOutlined style={{ color: tierInfo.color }} />
                  <span>Membership Tier</span>
                </Space>
              }
              value={tierInfo.name}
              valueStyle={{ fontSize: 20, color: tierInfo.color }}
              prefix={<CrownOutlined />}
            />
            <Progress
              percent={identityData.tier * 20}
              showInfo={false}
              strokeColor={tierInfo.color}
              size="small"
            />
          </Card>
        </Col>

        {/* Risk Score */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <WarningOutlined style={{ color: riskInfo.color }} />
                <Text type="secondary">Risk Score</Text>
              </Space>
              <Row align="middle" gutter={16}>
                <Col>
                  <Progress
                    type="circle"
                    percent={identityData.riskScore}
                    size={80}
                    strokeColor={riskInfo.color}
                    format={(percent) => (
                      <span style={{ color: riskInfo.color, fontWeight: 600 }}>{percent}</span>
                    )}
                  />
                </Col>
                <Col>
                  <Tag color={riskInfo.color} style={{ marginBottom: 4 }}>
                    {riskInfo.level}
                  </Tag>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    out of 100
                  </Text>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* PEP Status */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <SafetyOutlined style={{ color: '#2563eb' }} />
                <Text type="secondary">PEP Status</Text>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Tag
                  icon={
                    identityData.pep === 0 ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
                  }
                  color={identityData.pep === 0 ? 'success' : 'warning'}
                  style={{ fontSize: 16, padding: '8px 16px' }}
                >
                  {identityData.pep === 0 ? 'Not a PEP' : 'Politically Exposed'}
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Politically Exposed Person check
              </Text>
            </Space>
          </Card>
        </Col>

        {/* Watchlist Status */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <WarningOutlined style={{ color: '#f59e0b' }} />
                <Text type="secondary">Watchlist Status</Text>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Tag
                  icon={watchlistInfo.icon}
                  color={watchlistInfo.color}
                  style={{ fontSize: 16, padding: '8px 16px' }}
                >
                  {watchlistInfo.status}
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Level: {identityData.watchlist} / 5
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Timestamps */}
      <Card style={{ marginTop: 16 }} bordered={false}>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} sm={10}>
            <Space>
              <ClockCircleOutlined style={{ color: '#64748b' }} />
              <Text type="secondary">Created:</Text>
              <Tooltip title={new Date(Number(identityData.createdAt) * 1000).toLocaleString()}>
                <Text strong>
                  {formatDistanceToNow(new Date(Number(identityData.createdAt) * 1000), {
                    addSuffix: true,
                  })}
                </Text>
              </Tooltip>
            </Space>
          </Col>
          <Col xs={24} sm={10}>
            <Space>
              <ClockCircleOutlined style={{ color: '#64748b' }} />
              <Text type="secondary">Updated:</Text>
              <Tooltip title={new Date(Number(identityData.updatedAt) * 1000).toLocaleString()}>
                <Text strong>
                  {formatDistanceToNow(new Date(Number(identityData.updatedAt) * 1000), {
                    addSuffix: true,
                  })}
                </Text>
              </Tooltip>
            </Space>
          </Col>
          <Col xs={24} sm={4} style={{ textAlign: 'right' }}>
            <Button
              icon={<ReloadOutlined spin={isRefetching} />}
              onClick={handleRefresh}
              loading={isRefetching}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Privacy Notice */}
      <Alert
        style={{ marginTop: 16 }}
        message="Privacy Protected by FHE"
        description={
          <Space direction="vertical" size={4}>
            <Text>
              Your net worth is encrypted using Zama's Fully Homomorphic Encryption (fhEVM 0.9.1).
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              The encrypted value can be used in smart contract computations without revealing the
              actual amount. Only you have the permission to decrypt and view your net worth.
            </Text>
          </Space>
        }
        type="info"
        showIcon
        icon={<LockOutlined />}
      />
    </div>
  );
};
