/**
 * Columns Configuration Section
 *
 * Visual interface for configuring table columns without writing JSON.
 * Allows adding, removing, and reordering columns with validation.
 */

import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Card,
  Space,
  Alert,
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ColumnHeightOutlined,
} from '@ant-design/icons';

const ColumnsConfigSection = ({ value = [], onChange }) => {
  /**
   * Adds a new empty column
   */
  const handleAddColumn = () => {
    const newColumn = {
      key: `col_${Date.now()}`,
      title: '',
      dataIndex: '',
      sortable: true,
      clickable: false,
      width: undefined,
    };

    onChange([...value, newColumn]);
  };

  /**
   * Removes a column by index
   */
  const handleRemoveColumn = (index) => {
    const newColumns = value.filter((_, i) => i !== index);
    onChange(newColumns);
  };

  /**
   * Updates a specific column field
   */
  const handleColumnChange = (index, field, fieldValue) => {
    const newColumns = [...value];
    newColumns[index] = {
      ...newColumns[index],
      [field]: fieldValue,
    };

    // Auto-generate key from dataIndex if dataIndex changes
    if (field === 'dataIndex' && fieldValue) {
      newColumns[index].key = fieldValue;
    }

    onChange(newColumns);
  };

  /**
   * Validates column configuration
   */
  const getColumnValidation = (column) => {
    const errors = [];

    if (!column.title || !column.title.trim()) {
      errors.push('Column title is required');
    }

    if (!column.dataIndex || !column.dataIndex.trim()) {
      errors.push('Data field is required');
    }

    return errors;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Table Columns Configuration"
        description="Define which columns to display in your table. Each column needs a title (what users see) and a data field (property name from API response)."
        type="info"
        showIcon
        icon={<ColumnHeightOutlined />}
      />

      {value.length === 0 && (
        <Alert
          message="No columns configured"
          description="Click the button below to add your first column"
          type="warning"
          showIcon
        />
      )}

      {value.map((column, index) => {
        const validation = getColumnValidation(column);
        const hasErrors = validation.length > 0;

        return (
          <Card
            key={column.key || index}
            size="small"
            title={
              <Space>
                <span>Column {index + 1}</span>
                {column.title && <span style={{ fontWeight: 'normal' }}>- {column.title}</span>}
              </Space>
            }
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveColumn(index)}
              >
                Remove
              </Button>
            }
            style={{
              borderColor: hasErrors ? '#ff4d4f' : undefined,
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Column Display Name
                        <Tooltip title="This is what users will see in the table header">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                    required
                    validateStatus={!column.title ? 'error' : 'success'}
                  >
                    <Input
                      value={column.title}
                      onChange={(e) =>
                        handleColumnChange(index, 'title', e.target.value)
                      }
                      placeholder="Name"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Data Field Name
                        <Tooltip title="The exact property name from your API response (case-sensitive)">
                          <InfoCircleOutlined style={{ color: '#1890ff' }} />
                        </Tooltip>
                      </Space>
                    }
                    required
                    validateStatus={!column.dataIndex ? 'error' : 'success'}
                  >
                    <Input
                      value={column.dataIndex}
                      onChange={(e) =>
                        handleColumnChange(index, 'dataIndex', e.target.value)
                      }
                      placeholder="name"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Column Width (Optional)">
                    <InputNumber
                      value={column.width}
                      onChange={(val) =>
                        handleColumnChange(index, 'width', val)
                      }
                      placeholder="Auto"
                      min={50}
                      max={1000}
                      addonAfter="px"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label=" " colon={false}>
                    <Checkbox
                      checked={column.sortable}
                      onChange={(e) =>
                        handleColumnChange(index, 'sortable', e.target.checked)
                      }
                    >
                      Enable sorting
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label=" " colon={false}>
                    <Checkbox
                      checked={column.clickable}
                      onChange={(e) =>
                        handleColumnChange(index, 'clickable', e.target.checked)
                      }
                    >
                      <Tooltip title="When enabled, clicking cells will log data to console">
                        <span>
                          Enable click action <InfoCircleOutlined />
                        </span>
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              {hasErrors && (
                <Alert
                  message="Column configuration incomplete"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {validation.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  }
                  type="error"
                  showIcon
                  closable
                />
              )}
            </Space>
          </Card>
        );
      })}

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddColumn}
        block
        size="large"
      >
        Add Column
      </Button>

      {value.length > 0 && (
        <Alert
          message={`${value.length} column${value.length > 1 ? 's' : ''} configured`}
          type="success"
          showIcon
        />
      )}
    </Space>
  );
};

export default ColumnsConfigSection;
