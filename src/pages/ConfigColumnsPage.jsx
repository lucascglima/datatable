/**
 * Config Columns Page
 * Página de configuração de colunas
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Alert } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import ColumnsConfig from '../components/ConfigPanel/ColumnsConfig';

const { Title, Paragraph } = Typography;

const ConfigColumnsPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { getTableById, updateTableConfig, setActiveTable } = useTables();

  const table = getTableById(tableId);
  const config = table?.config;

  const [columns, setColumns] = useState([]);

  // Set active table
  useEffect(() => {
    if (tableId) {
      setActiveTable(tableId);
    }
  }, [tableId, setActiveTable]);

  // Load columns when config changes
  useEffect(() => {
    if (config && config.columns) {
      setColumns(config.columns);
    }
  }, [config]);

  const handleSave = () => {
    if (!table) {
      message.error('Tabela não encontrada');
      return;
    }

    const newConfig = {
      ...config,
      columns,
    };

    updateTableConfig(tableId, newConfig);
    message.success('Colunas salvas com sucesso!');
  };

  // Table not found
  if (!table) {
    return (
      <div className="page-container">
        <Card>
          <Alert
            message="Tabela não encontrada"
            description="A tabela que você está tentando configurar não existe."
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/tables')}>
                Ver Minhas Tabelas
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/table/${tableId}`)}
              style={{ paddingLeft: 0, marginBottom: 8 }}
            >
              Voltar para {table.name}
            </Button>
            <Title level={2} className="page-title">
              Configuração de Colunas
            </Title>
            <Paragraph className="page-description">
              Configure as colunas da tabela "{table.name}" com renderização personalizada.
            </Paragraph>
          </div>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Salvar Colunas
          </Button>
        </div>
      </div>

      <Card>
        <ColumnsConfig value={columns} onChange={setColumns} />
      </Card>

      {/* Footer Actions */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={() => navigate(`/table/${tableId}`)}>Cancelar</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Salvar Colunas
        </Button>
      </div>
    </div>
  );
};

export default ConfigColumnsPage;
