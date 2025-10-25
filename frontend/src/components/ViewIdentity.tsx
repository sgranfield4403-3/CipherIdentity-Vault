import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Space, Typography, Statistic, Divider, Spin, Alert } from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  CrownOutlined,
  SafetyOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAccount, useReadContract } from 'wagmi';
import { contractConfig } from '../config/contract';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;

interface PlaintextData {
  domicile: number;
  tier: number;
  pep: number;
  watchlist: number;
  riskScore: number;
  createdAt: bigint;
  updatedAt: bigint;
}

export const ViewIdentity: React.FC = () => {
  const { address } = useAccount();
  const [identityData, setIdentityData] = useState<PlaintextData | null>(null);

  const { data, isLoading, isError, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'getPlaintextData',
    args: address ? [address] : undefined,
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

  if (isLoading) {
    return (
      <Card style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 16 }}>Loading identity data...</Text>
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
        />
      </Card>
    );
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'green';
    if (score < 60) return 'orange';
    return 'red';
  };

  const getWatchlistStatus = (level: number) => {
    const statuses = ['Clear', 'Low', 'Medium', 'Elevated', 'High', 'Critical'];
    return statuses[level] || 'Unknown';
  };

  const getWatchlistColor = (level: number) => {
    const colors = ['green', 'blue', 'gold', 'orange', 'red', 'red'];
    return colors[level] || 'default';
  };

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          <span>Your Identity</span>
        </Space>
      }
      style={{ maxWidth: 1000, margin: '0 auto' }}
    >
      <Row gutter={[24, 24]}>
        {/* Net Worth - Encrypted */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ background: '#f7f9fc' }}>
            <Statistic
              title={
                <Space>
                  <LockOutlined />
                  <span>Net Worth</span>
                </Space>
              }
              value="ENCRYPTED"
              valueStyle={{ color: '#2563EB', fontSize: '20px' }}
              prefix={<LockOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Protected by FHE encryption
            </Text>
          </Card>
        </Col>

        {/* Domicile */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ background: '#f7f9fc' }}>
            <Statistic
              title={
                <Space>
                  <GlobalOutlined />
                  <span>Domicile</span>
                </Space>
              }
              value={identityData.domicile}
              suffix="/ 100"
              valueStyle={{ color: '#2563EB' }}
            />
          </Card>
        </Col>

        {/* Tier */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ background: '#f7f9fc' }}>
            <Statistic
              title={
                <Space>
                  <CrownOutlined />
                  <span>Tier</span>
                </Space>
              }
              value={`Tier ${identityData.tier}`}
              valueStyle={{ color: '#2563EB' }}
            />
          </Card>
        </Col>

        {/* PEP Status */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ background: '#f7f9fc' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">
                <SafetyOutlined /> PEP Status
              </Text>
              <Tag
                color={identityData.pep === 0 ? 'green' : 'orange'}
                style={{ fontSize: 16, padding: '4px 12px' }}
              >
                {identityData.pep === 0 ? 'Not a PEP' : 'Politically Exposed'}
              </Tag>
            </Space>
          </Card>
        </Col>

        {/* Watchlist Status */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ background: '#f7f9fc' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">
                <WarningOutlined /> Watchlist Status
              </Text>
              <Tag
                color={getWatchlistColor(identityData.watchlist)}
                style={{ fontSize: 16, padding: '4px 12px' }}
              >
                {getWatchlistStatus(identityData.watchlist)}
              </Tag>
            </Space>
          </Card>
        </Col>

        {/* Risk Score */}
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} style={{ background: '#f7f9fc' }}>
            <Statistic
              title={
                <Space>
                  <WarningOutlined />
                  <span>Risk Score</span>
                </Space>
              }
              value={identityData.riskScore}
              suffix="/ 100"
              valueStyle={{ color: getRiskColor(identityData.riskScore) }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Timestamps */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12}>
          <Space direction="vertical">
            <Text type="secondary">
              <ClockCircleOutlined /> Created
            </Text>
            <Text strong>
              {formatDistanceToNow(new Date(Number(identityData.createdAt) * 1000), {
                addSuffix: true,
              })}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(Number(identityData.createdAt) * 1000).toLocaleString()}
            </Text>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical">
            <Text type="secondary">
              <ClockCircleOutlined /> Last Updated
            </Text>
            <Text strong>
              {formatDistanceToNow(new Date(Number(identityData.updatedAt) * 1000), {
                addSuffix: true,
              })}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(Number(identityData.updatedAt) * 1000).toLocaleString()}
            </Text>
          </Space>
        </Col>
      </Row>

      <Divider />

      <Alert
        message="Privacy Protected"
        description="Your net worth is encrypted using Fully Homomorphic Encryption (FHE) and cannot be viewed in plaintext, ensuring complete privacy while allowing computations."
        type="info"
        showIcon
        icon={<LockOutlined />}
      />
    </Card>
  );
};