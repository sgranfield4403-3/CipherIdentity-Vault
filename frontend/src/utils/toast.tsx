import React from 'react';
import { message, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, LinkOutlined } from '@ant-design/icons';

// Sepolia block explorer URL
const BLOCK_EXPLORER_URL = 'https://sepolia.etherscan.io';

/**
 * Get transaction URL for block explorer
 */
export const getTxUrl = (hash: string): string => {
  return `${BLOCK_EXPLORER_URL}/tx/${hash}`;
};

/**
 * Get address URL for block explorer
 */
export const getAddressUrl = (address: string): string => {
  return `${BLOCK_EXPLORER_URL}/address/${address}`;
};

/**
 * Truncate hash for display
 */
export const truncateHash = (hash: string, chars = 6): string => {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
};

/**
 * Show transaction submitted notification
 */
export const showTxSubmitted = (hash: string): void => {
  notification.info({
    message: 'Transaction Submitted',
    description: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>Your transaction has been submitted to the network.</p>
        <a
          href={getTxUrl(hash)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#1890ff',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'monospace'
          }}
        >
          <LinkOutlined />
          {truncateHash(hash)}
        </a>
      </div>
    ),
    icon: <LoadingOutlined style={{ color: '#1890ff' }} />,
    duration: 5,
    placement: 'topRight',
  });
};

/**
 * Show transaction confirmed (success) notification
 */
export const showTxSuccess = (hash: string, title: string = 'Transaction Confirmed'): void => {
  notification.success({
    message: title,
    description: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>Your transaction has been confirmed on the blockchain.</p>
        <a
          href={getTxUrl(hash)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#52c41a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'monospace'
          }}
        >
          <LinkOutlined />
          View on Etherscan: {truncateHash(hash)}
        </a>
      </div>
    ),
    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    duration: 8,
    placement: 'topRight',
  });
};

/**
 * Show transaction failed notification
 */
export const showTxFailed = (hash: string | null, errorMessage: string): void => {
  notification.error({
    message: 'Transaction Failed',
    description: (
      <div>
        <p style={{ margin: '0 0 8px 0', color: '#ff4d4f' }}>{errorMessage}</p>
        {hash && (
          <a
            href={getTxUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ff4d4f',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'monospace'
            }}
          >
            <LinkOutlined />
            View on Etherscan: {truncateHash(hash)}
          </a>
        )}
      </div>
    ),
    icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    duration: 10,
    placement: 'topRight',
  });
};

/**
 * Show transaction rejected by user notification
 */
export const showTxRejected = (): void => {
  notification.warning({
    message: 'Transaction Rejected',
    description: 'You rejected the transaction in your wallet.',
    duration: 5,
    placement: 'topRight',
  });
};

/**
 * Show loading message (returns destroy function)
 */
export const showLoading = (content: string): (() => void) => {
  return message.loading(content, 0);
};

/**
 * Show error message
 */
export const showError = (content: string): void => {
  message.error(content);
};

/**
 * Show success message
 */
export const showSuccess = (content: string): void => {
  message.success(content);
};
