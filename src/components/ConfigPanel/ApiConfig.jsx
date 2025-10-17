/**
 * API Configuration Tab
 * Nova estrutura: URL Base + Path + Path Params + Query Params
 * Configuração intuitiva e visual com preview da URL final
 */

import React from 'react';
import { Form, Input, Button, Space, Divider, Tooltip, Alert, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ParamsTable from '../shared/ParamsTable';
import UrlPreview from '../shared/UrlPreview';

const { Text } = Typography;

const ApiConfig = ({ value = {}, onChange }) => {
  const {
    baseURL = '',
    path = '',
    pathParams = [],
    queryParams = [],
    token = '',
    headers = [],
  } = value;

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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Base URL */}
      <Form.Item
        label={
          <Space>
            <Text strong>URL Base</Text>
            <Tooltip
              title={
                <div>
                  <p><strong>O que é?</strong></p>
                  <p>É o endereço principal da sua API, sem o caminho específico.</p>
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
            💡 Ex: https://jsonplaceholder.typicode.com (apenas o domínio, sem o caminho)
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

      {/* Path */}
      <Form.Item
        label={
          <Space>
            <Text strong>Caminho (Path)</Text>
            <Tooltip
              title={
                <div>
                  <p><strong>O que é?</strong></p>
                  <p>É o caminho específico do recurso que você quer acessar na API.</p>
                  <p><strong>Exemplos:</strong></p>
                  <p>/users - Lista todos os usuários</p>
                  <p>/posts - Lista todos os posts</p>
                  <p>/users/{'{userId}'} - Usuário específico (com variável)</p>
                  <p><strong>Variáveis:</strong></p>
                  <p>Use {'{nomeVariavel}'} para criar variáveis no path.</p>
                </div>
              }
            >
              <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
            </Tooltip>
          </Space>
        }
        help={
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Ex: /users ou /users/{':userId'} 
          </Text>
        }
      >
        <Input
          placeholder="/users"
          value={path}
          onChange={(e) => updateConfig({ path: e.target.value })}
          size="large"
          prefix="📁"
        />
      </Form.Item>

      <Divider>
        <Space>
          Variáveis do Path (Path Params)
          <Tooltip
            title={
              <div>
                <p><strong>O que são?</strong></p>
                <p>Valores que substituem as variáveis no path.</p>
                <p><strong>Exemplo:</strong></p>
                <p>Se o path é /users/{'{userId}'}</p>
                <p>E você adicionar: userId = 123</p>
                <p>A URL final será: /users/123</p>
              </div>
            }
          >
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>
        </Space>
      </Divider>
      <ParamsTable
        params={pathParams}
        onChange={(newParams) => updateConfig({ pathParams: newParams })}
        type="path"
      />

      <Divider>
        <Space>
          Parâmetros de Consulta (Query Params)
          <Tooltip
            title={
              <div>
                <p><strong>O que são?</strong></p>
                <p>Parâmetros enviados na URL após o "?"</p>
                <p><strong>Exemplo:</strong></p>
                <p>?page=1&limit=20&sort=name</p>
                <p><strong>Referências Automáticas:</strong></p>
                <p>Configure para atualizar automaticamente quando o usuário:</p>
                <ul>
                  <li>Mudar de página</li>
                  <li>Alterar itens por página</li>
                  <li>Ordenar colunas</li>
                </ul>
              </div>
            }
          >
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>
        </Space>
      </Divider>
      <ParamsTable
        params={queryParams}
        onChange={(newParams) => updateConfig({ queryParams: newParams })}
        type="query"
      />

      <Divider>Preview da URL</Divider>

      <UrlPreview
        baseURL={baseURL}
        path={path}
        pathParams={pathParams}
        queryParams={queryParams}
        showValidation={true}
      />

      {/* Token */}
      <Divider>Autenticação</Divider>

      <Form.Item
        label={
          <Space>
            <Text>Token de Acesso</Text>
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
            Opcional - Deixe em branco se sua API não exigir autenticação
          </Text>
        }
      >
        <Input.Password
          placeholder="Cole aqui o token fornecido pela API (se tiver)"
          value={token}
          onChange={(e) => updateConfig({ token: e.target.value })}
          size="large"
        />
      </Form.Item>

      <Divider>
        <Space>
          Headers Personalizados (Avançado)
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

      {/* Headers */}
      {headers.map((header, index) => (
        <div key={index} style={{
          marginBottom: 12,
          padding: 16,
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          backgroundColor: '#fafafa'
        }}>
          <Space style={{ width: '100%' }} direction="vertical" size="small">
            <Space style={{ width: '100%' }}>
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
                />
              </div>
            </Space>
          </Space>
        </div>
      ))}
      <Button type="dashed" icon={<PlusOutlined />} onClick={addHeader} block>
        Adicionar Header Personalizado
      </Button>
    </Space>
  );
};

export default ApiConfig;
