/**
 * Tables List Page
 * Página "Minhas Tabelas" - lista todas as tabelas do usuário
 */

import React, { useState } from 'react';
import { Card, Button, Typography, Space, message } from 'antd';
import { PlusOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import {
  TableList,
  CreateTableModal,
  EditTableModal,
  DeleteConfirmModal,
} from '../components/TableManager';
import { getExampleConfig } from '../utils/preset-examples';

const { Title, Paragraph } = Typography;

const TablesListPage = () => {
  const navigate = useNavigate();
  const {
    tables,
    activeTableId,
    createTable,
    updateTable,
    deleteTable,
    duplicateTable,
    setActiveTable,
  } = useTables();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get user tables (non-examples)
  const userTables = tables.filter((t) => !t.isExample);

  /**
   * Handle create table
   */
  const handleCreate = async (data) => {
    const { name, description, startMode } = data;

    if (startMode === 'example') {
      // Create table and redirect to examples
      const newTable = createTable(name, description);
      setCreateModalVisible(false);
      message.success(`Tabela "${name}" criada! Escolha um exemplo para carregar.`);
      navigate(`/examples?tableId=${newTable.id}`);
    } else {
      // Create empty table and redirect to config
      const newTable = createTable(name, description);
      setCreateModalVisible(false);
      message.success(`Tabela "${name}" criada! Configure a API para começar.`);
      navigate(`/config/${newTable.id}/general`);
    }
  };

  /**
   * Handle view table
   */
  const handleView = (table) => {
    setActiveTable(table.id);
    navigate(`/table/${table.id}`);
  };

  /**
   * Handle edit table
   */
  const handleEditClick = (table) => {
    setSelectedTable(table);
    setEditModalVisible(true);
  };

  const handleEditSave = (data) => {
    updateTable(selectedTable.id, data);
    setEditModalVisible(false);
    setSelectedTable(null);
    message.success('Tabela atualizada com sucesso!');
  };

  /**
   * Handle delete table
   */
  const handleDeleteClick = (table) => {
    setSelectedTable(table);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      deleteTable(selectedTable.id);
      message.success(`Tabela "${selectedTable.name}" excluída com sucesso!`);
      setDeleteModalVisible(false);
      setSelectedTable(null);
    } catch (error) {
      message.error('Erro ao excluir tabela');
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handle duplicate table
   */
  const handleDuplicate = (table) => {
    const duplicated = duplicateTable(table.id);
    message.success(`Tabela duplicada como "${duplicated.name}"!`);
  };

  /**
   * Handle configure table
   */
  const handleConfigure = (table) => {
    setActiveTable(table.id);
    navigate(`/config/${table.id}/general`);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} className="page-title">
              📊 Minhas Tabelas
            </Title>
            <Paragraph className="page-description">
              Gerencie todas as suas tabelas configuráveis em um só lugar
            </Paragraph>
          </div>
          <Space className="button-group">
            <Button
              icon={<RocketOutlined />}
              onClick={() => navigate('/examples')}
              size="large"
            >
              Ver Exemplos
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              size="large"
            >
              Nova Tabela
            </Button>
          </Space>
        </div>
      </div>

      {/* Table List */}
      <Card>
        <TableList
          tables={userTables}
          activeTableId={activeTableId}
          onView={handleView}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onDuplicate={handleDuplicate}
          onConfigure={handleConfigure}
        />
      </Card>

      {/* Modals */}
      <CreateTableModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreate}
        existingTables={userTables}
      />

      <EditTableModal
        visible={editModalVisible}
        table={selectedTable}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedTable(null);
        }}
        onOk={handleEditSave}
        existingTables={userTables}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        table={selectedTable}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedTable(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
};

export default TablesListPage;
