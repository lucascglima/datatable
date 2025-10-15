/**
 * Table List Component
 * Lista todas as tabelas do usuário
 */

import React, { useState, useMemo } from 'react';
import { Row, Col, Empty, Input, Select, Space, Typography } from 'antd';
import { SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import TableCard from './TableCard';
import { sortTables, filterTables } from '../../utils/table-utils';

const { Text } = Typography;

const TableList = ({
  tables,
  activeTableId,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onConfigure,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  // Filter and sort tables
  const processedTables = useMemo(() => {
    let result = tables;

    // Filter by search
    if (searchQuery) {
      result = filterTables(result, searchQuery);
    }

    // Sort
    result = sortTables(result, sortBy);

    return result;
  }, [tables, searchQuery, sortBy]);

  if (tables.length === 0) {
    return (
      <Empty
        description={
          <Space direction="vertical" size="small">
            <Text strong>Nenhuma tabela criada ainda</Text>
            <Text type="secondary">Clique em "Nova Tabela" para começar!</Text>
          </Space>
        }
      />
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Filters */}
      <Row gutter={16}>
        <Col xs={24} sm={16} md={18}>
          <Input
            placeholder="Buscar tabelas por nome ou descrição..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            value={sortBy}
            onChange={setSortBy}
            size="large"
            style={{ width: '100%' }}
            suffixIcon={<SortAscendingOutlined />}
          >
            <Select.Option value="updated">Recente</Select.Option>
            <Select.Option value="created">Data de Criação</Select.Option>
            <Select.Option value="name">Nome (A-Z)</Select.Option>
          </Select>
        </Col>
      </Row>

      {/* Results count */}
      {searchQuery && (
        <Text type="secondary">
          {processedTables.length} {processedTables.length === 1 ? 'resultado' : 'resultados'} encontrado
          {processedTables.length === 1 ? '' : 's'}
        </Text>
      )}

      {/* Table Cards */}
      {processedTables.length > 0 ? (
        <Row gutter={[24, 24]}>
          {processedTables.map((table) => (
            <Col xs={24} sm={24} md={12} lg={8} key={table.id}>
              <TableCard
                table={table}
                isActive={table.id === activeTableId}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onConfigure={onConfigure}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description={
            <Space direction="vertical" size="small">
              <Text strong>Nenhum resultado encontrado</Text>
              <Text type="secondary">Tente buscar por outro termo</Text>
            </Space>
          }
        />
      )}
    </Space>
  );
};

export default TableList;
