/**
 * Pagination Configuration
 * Configuração de parâmetros de paginação da API
 */

import React from 'react';
import { Form, Input, InputNumber, Select, Switch, Space, Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const PaginationConfig = ({ value = {}, onChange }) => {
  const {
    enabled = true,
    pageNumberParam = 'page',
    pageSizeParam = 'limit',
    defaultPageSize = 20,
    pageSizeOptions = [10, 20, 50, 100],
    showSizeChanger = true,
    startFrom = 1, // 0 or 1
  } = value;

  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  const updatePageSizeOptions = (optionsString) => {
    try {
      const options = optionsString.split(',').map((s) => parseInt(s.trim())).filter(n => !isNaN(n));
      updateField('pageSizeOptions', options);
    } catch (error) {
      console.error('Invalid page size options:', error);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Paginação"
        description="Configure como os parâmetros de paginação serão enviados para a API."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      <Form layout="vertical">
        <Form.Item
          label="Habilitar Paginação"
          help="Ative para enviar parâmetros de paginação nas requisições"
        >
          <Switch
            checked={enabled}
            onChange={(checked) => updateField('enabled', checked)}
            checkedChildren="Habilitado"
            unCheckedChildren="Desabilitado"
          />
        </Form.Item>

        {enabled && (
          <>
            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                label="Parâmetro do Número da Página"
                help="Nome do parâmetro enviado (ex: page, pageNumber, offset)"
                style={{ flex: 1 }}
              >
                <Input
                  placeholder="page"
                  value={pageNumberParam}
                  onChange={(e) => updateField('pageNumberParam', e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Parâmetro do Tamanho da Página"
                help="Nome do parâmetro enviado (ex: limit, pageSize, perPage)"
                style={{ flex: 1 }}
              >
                <Input
                  placeholder="limit"
                  value={pageSizeParam}
                  onChange={(e) => updateField('pageSizeParam', e.target.value)}
                />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} size="large">
              <Form.Item
                label="Página Inicial"
                help="Primeira página começa em 0 ou 1?"
                style={{ flex: 1 }}
              >
                <Select
                  value={startFrom}
                  onChange={(val) => updateField('startFrom', val)}
                >
                  <Option value={0}>0 (zero-indexed)</Option>
                  <Option value={1}>1 (one-indexed)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Tamanho Padrão da Página"
                help="Quantidade de itens por página"
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  value={defaultPageSize}
                  onChange={(val) => updateField('defaultPageSize', val)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Space>

            <Form.Item
              label="Opções de Tamanho de Página"
              help="Lista de opções separadas por vírgula (ex: 10, 20, 50, 100)"
            >
              <Input
                placeholder="10, 20, 50, 100"
                value={pageSizeOptions.join(', ')}
                onChange={(e) => updatePageSizeOptions(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Mostrar Seletor de Tamanho"
              help="Permite ao usuário escolher quantos itens por página"
            >
              <Switch
                checked={showSizeChanger}
                onChange={(checked) => updateField('showSizeChanger', checked)}
                checkedChildren="Sim"
                unCheckedChildren="Não"
              />
            </Form.Item>
          </>
        )}
      </Form>

      <Alert
        message="Exemplos de Configuração"
        description={
          <div>
            <p><strong>API REST padrão:</strong></p>
            <ul>
              <li>Parâmetro da página: <code>page</code></li>
              <li>Parâmetro do tamanho: <code>limit</code></li>
              <li>Página inicial: 1</li>
              <li>Exemplo: <code>?page=1&limit=20</code></li>
            </ul>

            <p><strong>API com offset:</strong></p>
            <ul>
              <li>Parâmetro da página: <code>offset</code></li>
              <li>Parâmetro do tamanho: <code>limit</code></li>
              <li>Página inicial: 0</li>
              <li>Exemplo: <code>?offset=0&limit=20</code></li>
            </ul>
          </div>
        }
        type="success"
        showIcon
      />
    </Space>
  );
};

export default PaginationConfig;
