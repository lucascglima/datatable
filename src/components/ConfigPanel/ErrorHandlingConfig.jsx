/**
 * Error Handling Configuration Tab
 * 3 required fields: Status, Message, Action
 */

import React from 'react';
import { Form, Input, Select, Button, Space, Card, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';

const { Option } = Select;

const ErrorHandlingConfig = ({ value = [], onChange }) => {
  const addErrorHandler = () => {
    onChange([...value, { status: '', message: '', action: 'alert' }]);
  };

  const updateErrorHandler = (index, field, val) => {
    const newHandlers = [...value];
    newHandlers[index][field] = val;
    onChange(newHandlers);
  };

  const removeErrorHandler = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Tratamento de Erros HTTP"
        description="Configure como a aplicação deve reagir a diferentes códigos de status HTTP. Os 3 campos são obrigatórios."
        type="info"
        showIcon
        icon={<WarningOutlined />}
      />

      {value.map((handler, index) => (
        <Card key={index} size="small" title={`Erro ${handler.status || 'Novo'}`}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Status HTTP" required>
              <Input
                placeholder="ex: 401, 403, 500"
                value={handler.status}
                onChange={(e) => updateErrorHandler(index, 'status', e.target.value)}
                type="number"
              />
            </Form.Item>

            <Form.Item label="Mensagem" required>
              <Input.TextArea
                placeholder="Mensagem a ser exibida ao usuário"
                value={handler.message}
                onChange={(e) => updateErrorHandler(index, 'message', e.target.value)}
                rows={2}
              />
            </Form.Item>

            <Form.Item label="Ação" required>
              <Select
                value={handler.action}
                onChange={(val) => updateErrorHandler(index, 'action', val)}
              >
                <Option value="alert">Exibir Alerta</Option>
                <Option value="redirect">Redirecionar</Option>
                <Option value="log">Apenas Log (Console)</Option>
              </Select>
            </Form.Item>

            {handler.action === 'redirect' && (
              <Form.Item label="URL de Redirecionamento" required>
                <Input
                  placeholder="/login"
                  value={handler.redirectUrl || ''}
                  onChange={(e) => updateErrorHandler(index, 'redirectUrl', e.target.value)}
                />
              </Form.Item>
            )}

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeErrorHandler(index)}
              block
            >
              Remover Tratamento
            </Button>
          </Space>
        </Card>
      ))}

      <Button type="dashed" icon={<PlusOutlined />} onClick={addErrorHandler} block>
        Adicionar Tratamento de Erro
      </Button>

      {value.length === 0 && (
        <Alert
          message="Exemplos Comuns"
          description={
            <ul>
              <li><strong>401:</strong> Sessão expirada → Redirect para /login</li>
              <li><strong>403:</strong> Sem permissão → Alert</li>
              <li><strong>500:</strong> Erro do servidor → Alert</li>
            </ul>
          }
          type="warning"
        />
      )}
    </Space>
  );
};

export default ErrorHandlingConfig;
