/**
 * Example Page Component
 *
 * Demonstrates complete usage of DxpTable with external API and clickable cells.
 * Uses JSONPlaceholder public API for demonstration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Space, Typography, Button, Badge, Alert, notification } from 'antd';
import { ReloadOutlined, UserOutlined, CodeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import DxpTable from '../components/dxp-table';
import { fetchData } from '../services/external-api';

const { Title, Text, Paragraph } = Typography;

/**
 * Example Page Component
 *
 * Demonstrates DxpTable with clickable columns and console logging.
 * Uses JSONPlaceholder as a public API example.
 */
const ExamplePage = () => {
  const endpoint = 'https://jsonplaceholder.typicode.com/users';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  /**
   * Fetches data from API
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData(endpoint, '', pagination);
      setData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Handles cell click for clickable columns
   */
  const handleCellClick = (record, columnKey) => {
    console.log('=== CELL CLICKED ===');
    console.log('Column:', columnKey);
    console.log('Value:', record[columnKey]);
    console.log('Full Row Data:', record);
    console.log('---');

    setClickCount((prev) => prev + 1);

    notification.info({
      message: '🖱️ Cell Clicked',
      description: `Clicked on "${columnKey}". Check console (F12) for details.`,
      placement: 'bottomRight',
      duration: 2,
    });
  };

  /**
   * Column configuration with clickable cells
   */
  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      sortable: true,
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      render: (text, record) => (
        <span
          onClick={() => handleCellClick(record, 'name')}
          style={{
            cursor: 'pointer',
            color: '#1890ff',
            textDecoration: 'underline',
          }}
        >
          <UserOutlined /> {text}
        </span>
      ),
    },
    {
      key: 'username',
      title: 'Username',
      dataIndex: 'username',
      render: (text, record) => (
        <span
          onClick={() => handleCellClick(record, 'username')}
          style={{
            cursor: 'pointer',
            color: '#1890ff',
            textDecoration: 'underline',
          }}
        >
          @{text}
        </span>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      render: (text, record) => (
        <span
          onClick={() => handleCellClick(record, 'email')}
          style={{
            cursor: 'pointer',
            color: '#1890ff',
            textDecoration: 'underline',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      key: 'phone',
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      key: 'website',
      title: 'Website',
      dataIndex: 'website',
      render: (text, record) => (
        <span
          onClick={() => handleCellClick(record, 'website')}
          style={{
            cursor: 'pointer',
            color: '#1890ff',
            textDecoration: 'underline',
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  /**
   * Handles row click events
   */
  const handleRowClick = (record) => {
    console.log('=== ROW CLICKED ===');
    console.log('Complete Record:', record);
    console.log('---');

    setClickCount((prev) => prev + 1);
    notification.info({
      message: '🖱️ Row Clicked',
      description: 'Row data logged to console (Press F12 to view)',
      placement: 'bottomRight',
      duration: 2,
    });
  };

  /**
   * Handles pagination changes
   */
  const handlePaginationChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  /**
   * Handles sort - logs to console
   */
  const handleSort = (sortInfo) => {
    console.log('=== SORT REQUESTED ===');
    console.log('Column:', sortInfo.columnKey);
    console.log('Order:', sortInfo.order);
    console.log('---');
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    loadData();
  };

  /**
   * Opens browser console
   */
  const handleOpenConsole = () => {
    notification.info({
      message: 'How to Open Browser Console',
      description: (
        <div>
          <p><strong>Windows/Linux:</strong> Press F12 or Ctrl+Shift+J</p>
          <p><strong>Mac:</strong> Press Cmd+Option+J</p>
        </div>
      ),
      duration: 8,
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Interactive DataTable Example
              </Title>
              <Text type="secondary">
                Demonstrating clickable cells and console logging
              </Text>
            </div>
            <Space>
              <Badge count={clickCount} showZero>
                <Button icon={<InfoCircleOutlined />}>
                  Clicks
                </Button>
              </Badge>
              <Button
                icon={<CodeOutlined />}
                onClick={handleOpenConsole}
              >
                How to Open Console
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>

          {/* Instructions */}
          <Alert
            message="💡 Interactive Features"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Paragraph style={{ margin: 0 }}>
                  <strong>Click on highlighted cells or rows to see console output:</strong>
                </Paragraph>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Blue underlined text = Clickable cells (Name, Username, Email, Website)</li>
                  <li>Click any row to log the complete record</li>
                  <li>All clicks are logged to browser console</li>
                  <li>Press <strong>F12</strong> or click the button above to open console</li>
                </ul>
              </Space>
            }
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />

          {/* Error Display */}
          {error && (
            <Alert
              message="Error loading data"
              description={error}
              type="error"
              showIcon
              closable
            />
          )}

          {/* DataTable Component */}
          <DxpTable
            columns={columns}
            data={data}
            pagination={pagination}
            loading={loading}
            rowKey="id"
            onPaginationChange={handlePaginationChange}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />

          {/* Info Footer */}
          <Alert
            message="About this Example"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Paragraph style={{ margin: 0 }}>
                  This example uses the <strong>JSONPlaceholder</strong> public API:
                </Paragraph>
                <code style={{ display: 'block', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  {endpoint}
                </code>
                <Paragraph type="secondary" style={{ margin: 0, fontSize: '12px' }}>
                  This is a free fake REST API for testing and prototyping. No authentication required.
                </Paragraph>
              </Space>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default ExamplePage;
