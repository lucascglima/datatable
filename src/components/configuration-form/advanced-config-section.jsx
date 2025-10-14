/**
 * Advanced Configuration Section
 *
 * Configures advanced options like table name, API parameter names,
 * and response data path configuration.
 */

import React from 'react';
import {
  Form,
  Input,
  Card,
  Space,
  Alert,
  Row,
  Col,
  Tooltip,
  Collapse,
} from 'antd';
import {
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Panel } = Collapse;

const AdvancedConfigSection = ({ value = {}, onChange }) => {
  const defaultConfig = {
    tableName: 'Data Table',
    apiParamNames: {
      page: '_page',
      pageSize: '_limit',
      sort: 'sort',
    },
    responseDataPath: {
      dataKey: '', // Empty means root array or use 'data.items' for nested
      totalKey: 'x-total-count', // Can be header name or response property
      totalSource: 'header', // 'header' or 'body'
    },
    ...value,
  };

  /**
   * Handles configuration changes
   */
  const handleChange = (field, fieldValue) => {
    onChange({
      ...defaultConfig,
      [field]: fieldValue,
    });
  };

  /**
   * Handles nested object changes
   */
  const handleNestedChange = (parent, field, fieldValue) => {
    onChange({
      ...defaultConfig,
      [parent]: {
        ...defaultConfig[parent],
        [field]: fieldValue,
      },
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Advanced Settings"
        description="Configure table name and customize API request/response parameter names for better compatibility with your API."
        type="info"
        showIcon
        icon={<SettingOutlined />}
      />

      {/* Table Name */}
      <Card size="small" title="Table Identification">
        <Form.Item
          label={
            <Space>
              Table Name
              <Tooltip title="Display name for your table (shown in page title)">
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
              </Tooltip>
            </Space>
          }
        >
          <Input
            value={defaultConfig.tableName}
            onChange={(e) => handleChange('tableName', e.target.value)}
            placeholder="My Data Table"
            size="large"
          />
        </Form.Item>
      </Card>

      {/* API Parameters Configuration */}
      <Collapse defaultActiveKey={[]}>
        <Panel header="API Request Parameters (Advanced)" key="1">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Customize Parameter Names"
              description="Configure the parameter names used in API requests. Default values work with JSONPlaceholder API."
              type="info"
              showIcon
              size="small"
            />

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      Page Parameter
                      <Tooltip title="Query parameter name for page number (e.g., ?_page=1)">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Input
                    value={defaultConfig.apiParamNames.page}
                    onChange={(e) =>
                      handleNestedChange('apiParamNames', 'page', e.target.value)
                    }
                    placeholder="_page"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      Page Size Parameter
                      <Tooltip title="Query parameter name for items per page (e.g., ?_limit=20)">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Input
                    value={defaultConfig.apiParamNames.pageSize}
                    onChange={(e) =>
                      handleNestedChange('apiParamNames', 'pageSize', e.target.value)
                    }
                    placeholder="_limit"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <Space>
                      Sort Parameter
                      <Tooltip title="Query parameter name for sorting (e.g., ?sort=name:asc)">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Input
                    value={defaultConfig.apiParamNames.sort}
                    onChange={(e) =>
                      handleNestedChange('apiParamNames', 'sort', e.target.value)
                    }
                    placeholder="sort"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Alert
              message="Common API Patterns"
              description={
                <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                  <li><strong>JSONPlaceholder:</strong> _page, _limit</li>
                  <li><strong>Liferay:</strong> page, pageSize</li>
                  <li><strong>Generic REST:</strong> page, limit, per_page</li>
                  <li><strong>GraphQL:</strong> offset, first</li>
                </ul>
              }
              type="success"
              showIcon
              size="small"
            />
          </Space>
        </Panel>

        <Panel header="API Response Data Path (Advanced)" key="2">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Alert
              message="Configure Response Structure"
              description="Tell us where to find the data and total count in your API response."
              type="info"
              showIcon
              size="small"
            />

            <Form.Item
              label={
                <Space>
                  Data Array Path
                  <Tooltip title="Path to data array in response. Leave empty if response is array directly. Use dot notation for nested (e.g., 'data.items')">
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                </Space>
              }
            >
              <Input
                value={defaultConfig.responseDataPath.dataKey}
                onChange={(e) =>
                  handleNestedChange('responseDataPath', 'dataKey', e.target.value)
                }
                placeholder="Leave empty for root array, or use 'data.items'"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      Total Count Source
                      <Tooltip title="Where to find total records count">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Input
                    value={defaultConfig.responseDataPath.totalSource}
                    onChange={(e) =>
                      handleNestedChange('responseDataPath', 'totalSource', e.target.value)
                    }
                    placeholder="header or body"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={
                    <Space>
                      Total Count Key
                      <Tooltip title="Header name (e.g., 'x-total-count') or response property (e.g., 'totalCount')">
                        <InfoCircleOutlined style={{ color: '#1890ff' }} />
                      </Tooltip>
                    </Space>
                  }
                >
                  <Input
                    value={defaultConfig.responseDataPath.totalKey}
                    onChange={(e) =>
                      handleNestedChange('responseDataPath', 'totalKey', e.target.value)
                    }
                    placeholder="x-total-count or totalCount"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Alert
              message="Common Response Patterns"
              description={
                <div>
                  <p><strong>Pattern 1 - Direct Array:</strong></p>
                  <code style={{ display: 'block', padding: 8, background: '#f5f5f5', marginBottom: 8 }}>
                    {`[{id: 1, name: "John"}, ...]`}
                  </code>
                  <p>Config: dataKey = empty, totalSource = header, totalKey = x-total-count</p>

                  <p style={{ marginTop: 12 }}><strong>Pattern 2 - Wrapped Data:</strong></p>
                  <code style={{ display: 'block', padding: 8, background: '#f5f5f5', marginBottom: 8 }}>
                    {`{data: [...], totalCount: 100}`}
                  </code>
                  <p>Config: dataKey = data, totalSource = body, totalKey = totalCount</p>

                  <p style={{ marginTop: 12 }}><strong>Pattern 3 - Nested:</strong></p>
                  <code style={{ display: 'block', padding: 8, background: '#f5f5f5', marginBottom: 8 }}>
                    {`{response: {items: [...], total: 100}}`}
                  </code>
                  <p>Config: dataKey = response.items, totalSource = body, totalKey = response.total</p>
                </div>
              }
              type="success"
              showIcon
              size="small"
            />
          </Space>
        </Panel>
      </Collapse>
    </Space>
  );
};

export default AdvancedConfigSection;
