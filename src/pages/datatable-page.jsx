/**
 * DataTable Page
 *
 * Displays the configured DxpTable with data from the configured API.
 * Loads configuration from localStorage and handles data fetching.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Alert,
  Typography,
  Badge,
  message,
  notification,
} from 'antd';
import {
  ReloadOutlined,
  EditOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import DxpTable from '../components/dxp-table';
import { loadConfiguration, hasConfiguration } from '../services/config-storage';
import { fetchData } from '../services/external-api';

const { Title, Text, Paragraph } = Typography;

const DataTablePage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [clickCount, setClickCount] = useState(0);

  /**
   * Load configuration on mount
   */
  useEffect(() => {
    if (!hasConfiguration()) {
      // No configuration found
      return;
    }

    const loadedConfig = loadConfiguration();
    setConfig(loadedConfig);
    setPagination((prev) => ({
      ...prev,
      pageSize: loadedConfig.pagination?.pageSize || 20,
    }));
  }, []);

  /**
   * Fetch data when config or pagination changes
   */
  const fetchTableData = useCallback(async () => {
    if (!config) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchData(
        config.apiEndpoint,
        config.authToken,
        pagination
      );

      setData(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (err) {
      setError(err.message || 'Failed to load data');
      message.error('❌ ' + (err.message || 'Failed to load data'));
    } finally {
      setLoading(false);
    }
  }, [config, pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (config) {
      fetchTableData();
    }
  }, [config, pagination.current, pagination.pageSize]);

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
   * Handles column sort - for now just log it
   */
  const handleSort = (sortInfo) => {
    console.log('=== SORT REQUESTED ===');
    console.log('Column:', sortInfo.columnKey);
    console.log('Order:', sortInfo.order);
    console.log('Note: Client-side sorting not implemented yet');
    console.log('---');
    message.info('Sort logged to console (F12 to view)');
  };

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
   * Handles row click
   */
  const handleRowClick = (record) => {
    console.log('=== ROW CLICKED ===');
    console.log('Complete Record:', record);
    console.log('---');

    setClickCount((prev) => prev + 1);

    message.info('Row data logged to console (F12 to view)');
  };

  /**
   * Processes columns to add click handlers for clickable columns
   */
  const getProcessedColumns = () => {
    if (!config || !config.columns) return [];

    return config.columns.map((column) => {
      if (column.clickable) {
        return {
          ...column,
          render: (text, record) => (
            <span
              onClick={() => handleCellClick(record, column.key)}
              style={{
                cursor: 'pointer',
                color: '#1890ff',
                textDecoration: 'underline',
              }}
            >
              {text}
            </span>
          ),
        };
      }
      return column;
    });
  };

  /**
   * Handles refresh button click
   */
  const handleRefresh = () => {
    message.loading('Refreshing data...', 0.5);
    fetchTableData();
  };

  /**
   * Navigates to configuration page
   */
  const handleEditConfig = () => {
    navigate('/configuration');
  };

  // Show welcome message if no configuration
  if (!config) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <WarningOutlined style={{ fontSize: '64px', color: '#faad14' }} />
            <Title level={2}>Welcome! 👋</Title>
            <Paragraph>
              Let's configure your data table. Click the button below to get started.
            </Paragraph>
            <Paragraph type="secondary">
              Configuration is quick and easy - no coding required!
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/configuration')}
            >
              Go to Configuration
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header with Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                My DataTable
              </Title>
              <Text type="secondary">
                Data from: <code>{config.apiEndpoint}</code>
              </Text>
            </div>

            <Space>
              <Badge count={clickCount} showZero>
                <Button icon={<InfoCircleOutlined />}>
                  Clicks
                </Button>
              </Badge>
              <Button
                icon={<EditOutlined />}
                onClick={handleEditConfig}
              >
                Edit Configuration
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

          {/* Status Badge */}
          {!loading && !error && data.length > 0 && (
            <Alert
              message={`✅ ${pagination.total} records loaded successfully`}
              type="success"
              showIcon
              closable
            />
          )}

          {/* Error Display */}
          {error && (
            <Alert
              message="Failed to Load Data"
              description={
                <Space direction="vertical">
                  <Text>{error}</Text>
                  <Space>
                    <Button size="small" onClick={handleRefresh}>
                      Try Again
                    </Button>
                    <Button size="small" onClick={handleEditConfig}>
                      Edit Configuration
                    </Button>
                  </Space>
                </Space>
              }
              type="error"
              showIcon
            />
          )}

          {/* Instructions for clickable columns */}
          {config.columns.some((col) => col.clickable) && (
            <Alert
              message="💡 Interactive Table"
              description="Underlined blue text indicates clickable cells. Click on them or any row to log data to the browser console (Press F12)."
              type="info"
              showIcon
              closable
            />
          )}

          {/* DataTable */}
          <DxpTable
            columns={getProcessedColumns()}
            data={data}
            pagination={pagination}
            loading={loading}
            rowKey={(record) => record.id || record[config.columns[0]?.dataIndex] || Math.random()}
            onPaginationChange={handlePaginationChange}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />
        </Space>
      </Card>
    </div>
  );
};

export default DataTablePage;
