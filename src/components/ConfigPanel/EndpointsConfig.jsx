/**
 * Endpoints Configuration Tab
 * Endpoints configured here become available for use in column actions
 */

import React from 'react';
import { Form, Input, Select, Button, Space, Card, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const EndpointsConfig = ({ value = [], onChange }) => {
  const addEndpoint = () => {
    onChange([...value, { name: '', path: '', method: 'GET' }]);
  };

  const updateEndpoint = (index, field, val) => {
    const newEndpoints = [...value];
    newEndpoints[index][field] = val;
    onChange(newEndpoints);
  };

  const removeEndpoint = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Endpoints Disponíveis para Ações"
        description="Endpoints configurados aqui ficam disponíveis para uso em botões e ícones nas colunas da tabela."
        type="info"
        showIcon
      />

      {value.map((endpoint, index) => (
        <Card key={index} size="small" title={`Endpoint ${index + 1}`}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Nome (Identificador)" required>
              <Input
                placeholder="ex: getById, deleteUser"
                value={endpoint.name}
                onChange={(e) => updateEndpoint(index, 'name', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Caminho" required>
              <Input
                placeholder="ex: /users/{id}"
                value={endpoint.path}
                onChange={(e) => updateEndpoint(index, 'path', e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Método" required>
              <Select
                value={endpoint.method}
                onChange={(val) => updateEndpoint(index, 'method', val)}
              >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
              </Select>
            </Form.Item>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeEndpoint(index)}
              block
            >
              Remover Endpoint
            </Button>
          </Space>
        </Card>
      ))}

      <Button type="dashed" icon={<PlusOutlined />} onClick={addEndpoint} block>
        Adicionar Endpoint
      </Button>
    </Space>
  );
};

export default EndpointsConfig;
