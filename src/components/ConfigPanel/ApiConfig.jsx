/**
 * API Configuration Tab
 * Simple key/value configuration (NO JSON editors)
 */

import React from 'react';
import { Form, Input, Button, Space, Card, Divider, Tooltip, Alert, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ApiConfig = ({ value = {}, onChange }) => {
  const { baseURL = '', token = '', headers = [], body = [] } = value;

  const updateConfig = (updates) => {
    onChange({ ...value, ...updates });
  };

  const addHeader = () => {
    updateConfig({ headers: [...headers, { key: '', value: '' }] });
  };

  const updateHeader = (index, field, val) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = val;
    updateConfig({ headers: newHeaders });
  };

  const removeHeader = (index) => {
    updateConfig({ headers: headers.filter((_, i) => i !== index) });
  };

  const addBodyParam = () => {
    updateConfig({ body: [...body, { key: '', value: '' }] });
  };

  const updateBodyParam = (index, field, val) => {
    const newBody = [...body];
    newBody[index][field] = val;
    updateConfig({ body: newBody });
  };

  const removeBodyParam = (index) => {
    updateConfig({ body: body.filter((_, i) => i !== index) });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Help Alert */}
      <Alert
        message="🌐 O que é uma API?"
        description="Uma API é como um 'endereço na internet' de onde virão os dados da sua tabela. É tipo pedir informações para um site e receber de volta uma lista organizada."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        closable
      />

      {/* Base URL */}
      <Form.Item
        label={
          <Space>
            <Text>Endereço da API</Text>
            <Tooltip
              title={
                <div>
                  <p><strong>O que é?</strong></p>
                  <p>É o endereço principal da sua API, tipo um site mas para dados.</p>
                  <p><strong>Exemplo:</strong></p>
                  <p>https://jsonplaceholder.typicode.com</p>
                  <p>https://api.seusite.com</p>
                  <p><strong>Dica:</strong> Sempre começa com https://</p>
                </div>
              }
            >
              <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
            </Tooltip>
          </Space>
        }
        required
        help={
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Ex: https://jsonplaceholder.typicode.com (copie e cole o endereço aqui)
          </Text>
        }
      >
        <Input
          placeholder="https://api.example.com"
          value={baseURL}
          onChange={(e) => updateConfig({ baseURL: e.target.value })}
          size="large"
          prefix="🌐"
        />
      </Form.Item>

      {/* Token */}
      <Form.Item
        label={
          <Space>
            <Text>Senha de Acesso (Token)</Text>
            <Tooltip
              title={
                <div>
                  <p><strong>O que é?</strong></p>
                  <p>É como uma senha especial que algumas APIs pedem para liberar o acesso aos dados.</p>
                  <p><strong>Quando usar?</strong></p>
                  <p>Só se a API exigir autenticação. Muitas APIs públicas não precisam.</p>
                  <p><strong>Onde conseguir?</strong></p>
                  <p>O administrador da API deve fornecer essa senha para você.</p>
                </div>
              }
            >
              <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
            </Tooltip>
          </Space>
        }
        help={
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ⚠️ Opcional - Deixe em branco se sua API não exigir senha
          </Text>
        }
      >
        <Input.Password
          placeholder="Cole aqui a senha fornecida pela API (se tiver)"
          value={token}
          onChange={(e) => updateConfig({ token: e.target.value })}
          size="large"
        />
      </Form.Item>

      <Divider>
        <Space>
          Informações Extras (Headers)
          <Tooltip
            title={
              <div>
                <p><strong>O que são Headers?</strong></p>
                <p>São informações adicionais que você envia junto com o pedido à API.</p>
                <p><strong>Quando usar?</strong></p>
                <p>Somente se o administrador da API pediu para você adicionar.</p>
                <p><strong>Exemplo comum:</strong></p>
                <p>Nome: X-API-Version</p>
                <p>Valor: v1</p>
              </div>
            }
          >
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>
        </Space>
      </Divider>

      <Alert
        message="⚠️ Seção Avançada - Pule se não souber"
        description="Só adicione headers se o administrador da API te pediu. A maioria das APIs não precisa de headers extras."
        type="warning"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      {/* Headers */}
      {headers.map((header, index) => (
        <Card key={index} size="small" style={{ marginBottom: 8 }}>
          <Space style={{ width: '100%' }} align="start">
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                Nome do Header:
              </Text>
              <Input
                placeholder="Ex: X-Custom-Header"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                Valor:
              </Text>
              <Input
                placeholder="Ex: meu-valor"
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                &nbsp;
              </Text>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeHeader(index)}
                title="Remover este header"
              >
                Remover
              </Button>
            </div>
          </Space>
        </Card>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} onClick={addHeader} block>
        ➕ Adicionar Header Extra
      </Button>

      <Divider>
        <Space>
          Parâmetros do Body
          <Tooltip
            title={
              <div>
                <p><strong>O que são Body Params?</strong></p>
                <p>São dados extras enviados no corpo da requisição, geralmente para POST/PUT.</p>
                <p><strong>Quando usar?</strong></p>
                <p>Raramente necessário. Use apenas se a documentação da API exigir.</p>
              </div>
            }
          >
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>
        </Space>
      </Divider>

      <Alert
        message="⚠️ Seção Muito Avançada - Pule se não tiver certeza"
        description="Body params são raramente usados em tabelas de dados. Deixe em branco a menos que a documentação da API especifique."
        type="warning"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      {/* Body */}
      {body.map((param, index) => (
        <Card key={index} size="small" style={{ marginBottom: 8 }}>
          <Space style={{ width: '100%' }} align="start">
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                Nome do Parâmetro:
              </Text>
              <Input
                placeholder="Ex: clientId"
                value={param.key}
                onChange={(e) => updateBodyParam(index, 'key', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                Valor:
              </Text>
              <Input
                placeholder="Ex: 12345"
                value={param.value}
                onChange={(e) => updateBodyParam(index, 'value', e.target.value)}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                &nbsp;
              </Text>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeBodyParam(index)}
                title="Remover este parâmetro"
              >
                Remover
              </Button>
            </div>
          </Space>
        </Card>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} onClick={addBodyParam} block>
        ➕ Adicionar Parâmetro do Body
      </Button>
    </Space>
  );
};

export default ApiConfig;
