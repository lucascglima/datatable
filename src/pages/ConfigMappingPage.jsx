/**
 * Config Mapping Page
 * Página de configuração de mapeamento de campos
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Alert } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import MappingConfig from '../components/ConfigPanel/MappingConfig';

const { Title, Paragraph } = Typography;

const ConfigMappingPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { getTableById, updateTableConfig, setActiveTable } = useTables();

  const table = getTableById(tableId);
  const config = table?.config;

  const [mapping, setMapping] = useState({
    dataPath: '',
    currentPage: '',
    totalPages: '',
    totalItems: '',
  });

  // Set active table
  useEffect(() => {
    if (tableId) {
      setActiveTable(tableId);
    }
  }, [tableId, setActiveTable]);

  // Load mapping when config changes
  useEffect(() => {
    if (config && config.mapping) {
      setMapping(config.mapping);
    }
  }, [config]);

  const handleSave = () => {
    if (!table) {
      message.error('Tabela não encontrada');
      return;
    }

    const newConfig = {
      ...config,
      mapping,
    };

    updateTableConfig(tableId, newConfig);
    message.success('Mapeamento salvo com sucesso!');
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
              Mapeamento de Campos
            </Title>
            <Paragraph className="page-description">
              Configure como os dados da API serão mapeados para "{table.name}".
            </Paragraph>
          </div>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Salvar Mapeamento
          </Button>
        </div>
      </div>

      <Card>
        <MappingConfig value={mapping} onChange={setMapping} />
      </Card>

      {/* Footer Actions */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={() => navigate(`/table/${tableId}`)}>Cancelar</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Salvar Mapeamento
        </Button>
      </div>
    </div>
  );
};

export default ConfigMappingPage;
