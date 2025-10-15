/**
 * Response Mapping Configuration Tab
 * Specific fields for data structure mapping
 */

import React from 'react';
import { Form, Input, Space, Alert, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const MappingConfig = ({ value = {}, onChange }) => {
  const {
    dataPath = '',
    currentPage = '',
    totalPages = '',
    totalItems = '',
  } = value;

  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Mapeamento da Estrutura de Resposta"
        description="Configure onde encontrar cada informação na resposta da API. Deixe em branco se a API retorna o array diretamente."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      <Divider>Dados da Tabela</Divider>

      <Form.Item
        label="Caminho dos Dados (Array)"
        help="Caminho para o array de dados. Ex: 'data', 'results', 'items' ou deixe vazio se a resposta já é um array"
      >
        <Input
          placeholder="data (ou vazio para array direto)"
          value={dataPath}
          onChange={(e) => updateField('dataPath', e.target.value)}
        />
      </Form.Item>

      <Divider>Paginação</Divider>

      <Form.Item
        label="Campo: Página Atual"
        help="Nome do campo que contém o número da página atual. Ex: 'page', 'current_page'"
      >
        <Input
          placeholder="page"
          value={currentPage}
          onChange={(e) => updateField('currentPage', e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Campo: Total de Páginas"
        help="Nome do campo que contém o total de páginas. Ex: 'total_pages', 'totalPages'"
      >
        <Input
          placeholder="total_pages"
          value={totalPages}
          onChange={(e) => updateField('totalPages', e.target.value)}
        />
      </Form.Item>

      <Form.Item
        label="Campo: Total de Itens"
        help="Nome do campo que contém o total de registros. Ex: 'total', 'count', 'totalCount'"
      >
        <Input
          placeholder="total"
          value={totalItems}
          onChange={(e) => updateField('totalItems', e.target.value)}
        />
      </Form.Item>

      <Alert
        message="Exemplos de Uso"
        description={
          <div>
            <p><strong>JSONPlaceholder (array direto):</strong></p>
            <ul style={{ marginBottom: 16 }}>
              <li>Caminho dos Dados: <code>(vazio)</code></li>
              <li>Os outros campos também vazios</li>
            </ul>

            <p><strong>API com estrutura aninhada:</strong></p>
            <ul style={{ marginBottom: 16 }}>
              <li>Caminho dos Dados: <code>data.items</code></li>
              <li>Página Atual: <code>pagination.current</code></li>
              <li>Total de Páginas: <code>pagination.totalPages</code></li>
              <li>Total de Itens: <code>pagination.total</code></li>
            </ul>

            <p><strong>API com resposta plana:</strong></p>
            <ul>
              <li>Caminho dos Dados: <code>results</code></li>
              <li>Página Atual: <code>page</code></li>
              <li>Total de Páginas: <code>total_pages</code></li>
              <li>Total de Itens: <code>count</code></li>
            </ul>
          </div>
        }
        type="success"
        showIcon
      />
    </Space>
  );
};

export default MappingConfig;
