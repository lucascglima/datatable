/**
 * ParamsTable Component
 *
 * Componente reutilizável para gerenciar parâmetros (query params ou path params)
 * Permite adicionar, editar e remover parâmetros de forma intuitiva
 *
 * @component
 * @example
 * <ParamsTable
 *   params={[{name: 'page', value: '1', reference: 'PAGE_CHANGE', enabled: true}]}
 *   onChange={(newParams) => handleChange(newParams)}
 *   type="query"
 * />
 */

import React from 'react';
import { Table, Input, Select, Checkbox, Button, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

/**
 * Opções de referência para Query Params
 * Define quando o parâmetro será atualizado automaticamente
 */
const QUERY_PARAM_REFERENCES = [
  { value: 'PAGE_CHANGE', label: 'Mudança de Página', description: 'Atualiza quando usuário navega entre páginas' },
  { value: 'PAGE_SIZE_CHANGE', label: 'Mudança de Tamanho', description: 'Atualiza quando usuário altera itens por página' },
  { value: 'SORT_FIELD', label: 'Campo de Ordenação', description: 'Atualiza com o campo que está sendo ordenado' },
  { value: 'SORT_ORDER', label: 'Direção da Ordenação', description: 'Atualiza com ascendente/descendente' },
  { value: 'STATIC', label: 'Estático', description: 'Valor fixo, não muda automaticamente' },
];

const ParamsTable = ({
  params = [],
  onChange,
  type = 'query', // 'query' or 'path'
  title = 'Parâmetros'
}) => {

  /**
   * Adiciona um novo parâmetro à lista
   */
  const handleAddParam = () => {
    const newParam = type === 'query'
      ? { name: '', value: '', reference: 'STATIC', enabled: true }
      : { name: '', value: '', enabled: true };

    onChange([...params, newParam]);
  };

  /**
   * Atualiza um campo específico de um parâmetro
   */
  const handleUpdateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    onChange(newParams);
  };

  /**
   * Remove um parâmetro da lista
   */
  const handleRemoveParam = (index) => {
    onChange(params.filter((_, i) => i !== index));
  };

  /**
   * Define as colunas da tabela com base no tipo
   */
  const getColumns = () => {
    const baseColumns = [
      {
        title: (
          <Space>
            <Text strong>Nome</Text>
            <Tooltip title="Nome da variável que será enviada na requisição">
              <QuestionCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </Space>
        ),
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        render: (text, record, index) => (
          <Input
            placeholder={type === 'query' ? 'Ex: page' : 'Ex: userId'}
            value={text}
            onChange={(e) => handleUpdateParam(index, 'name', e.target.value)}
            size="small"
          />
        ),
      },
      {
        title: (
          <Space>
            <Text strong>Valor {type === 'query' ? 'Inicial' : ''}</Text>
            <Tooltip title={type === 'query'
              ? 'Valor padrão que será usado inicialmente'
              : 'Valor que será substituído na URL'
            }>
              <QuestionCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </Space>
        ),
        dataIndex: 'value',
        key: 'value',
        width: type === 'query' ? '25%' : '35%',
        render: (text, record, index) => (
          <Input
            placeholder={type === 'query' ? 'Ex: 1' : 'Ex: 123'}
            value={text}
            onChange={(e) => handleUpdateParam(index, 'value', e.target.value)}
            size="small"
          />
        ),
      },
    ];

    // Adiciona coluna de Referência apenas para Query Params
    if (type === 'query') {
      baseColumns.push({
        title: (
          <Space>
            <Text strong>Referência</Text>
            <Tooltip title="Define quando este parâmetro será atualizado automaticamente">
              <QuestionCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </Space>
        ),
        dataIndex: 'reference',
        key: 'reference',
        width: '25%',
        render: (text, record, index) => (
          <Select
            value={text}
            onChange={(value) => handleUpdateParam(index, 'reference', value)}
            size="small"
            style={{ width: '100%' }}
          >
            {QUERY_PARAM_REFERENCES.map(ref => (
              <Option key={ref.value} value={ref.value}>
                <Tooltip title={ref.description} placement="right">
                  {ref.label}
                </Tooltip>
              </Option>
            ))}
          </Select>
        ),
      });
    }

    // Coluna de Ativo (Checkbox)
    baseColumns.push({
      title: (
        <Space>
          <Text strong>Ativo</Text>
          <Tooltip title="Define se este parâmetro será enviado na requisição">
            <QuestionCircleOutlined style={{ color: '#1890ff' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'enabled',
      key: 'enabled',
      width: '10%',
      align: 'center',
      render: (checked, record, index) => (
        <Checkbox
          checked={checked}
          onChange={(e) => handleUpdateParam(index, 'enabled', e.target.checked)}
        />
      ),
    });

    // Coluna de Ações
    baseColumns.push({
      title: <Text strong>Ações</Text>,
      key: 'actions',
      width: '10%',
      align: 'center',
      render: (_, record, index) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveParam(index)}
          title="Remover parâmetro"
        />
      ),
    });

    return baseColumns;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Table
        columns={getColumns()}
        dataSource={params.map((param, index) => ({ ...param, key: index }))}
        pagination={false}
        size="small"
        bordered
        locale={{
          emptyText: `Nenhum parâmetro ${type === 'query' ? 'de consulta' : 'de caminho'} configurado`,
        }}
      />

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddParam}
        block
        style={{ marginTop: 8 }}
      >
        ➕ Adicionar {type === 'query' ? 'Query' : 'Path'} Param
      </Button>
    </div>
  );
};

export default ParamsTable;
