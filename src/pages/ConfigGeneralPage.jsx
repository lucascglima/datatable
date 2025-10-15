/**
 * Config General Page
 * Página de configuração geral (API, Endpoints, Erros)
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Upload, Divider, Alert } from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import ApiConfig from '../components/ConfigPanel/ApiConfig';
import PaginationConfig from '../components/ConfigPanel/PaginationConfig';
import EndpointsConfig from '../components/ConfigPanel/EndpointsConfig';
import ErrorHandlingConfig from '../components/ConfigPanel/ErrorHandlingConfig';

const { Title, Paragraph } = Typography;

const ConfigGeneralPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { getTableById, updateTableConfig, setActiveTable } = useTables();

  const table = getTableById(tableId);
  const config = table?.config;

  const [formData, setFormData] = useState({
    api: { baseURL: '', token: '', headers: [], body: [] },
    pagination: {
      enabled: true,
      pageNumberParam: 'page',
      pageSizeParam: 'limit',
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      showSizeChanger: true,
      startFrom: 1,
    },
    endpoints: [],
    errorHandlers: [],
  });

  // Set active table
  useEffect(() => {
    if (tableId) {
      setActiveTable(tableId);
    }
  }, [tableId, setActiveTable]);

  // Load config when table changes
  useEffect(() => {
    if (config) {
      setFormData({
        api: config.api || { baseURL: '', token: '', headers: [], body: [] },
        pagination: config.pagination || formData.pagination,
        endpoints: config.endpoints || [],
        errorHandlers: config.errorHandlers || [],
      });
    }
  }, [config]);

  const handleSave = () => {
    // Check if table exists
    if (!table) {
      message.error('Tabela não encontrada');
      return;
    }

    // Validate required fields
    if (!formData.api.baseURL) {
      message.error('Base URL é obrigatória');
      return;
    }

    // Validate error handlers
    const invalidHandlers = formData.errorHandlers.filter(
      (h) => !h.status || !h.message || !h.action
    );
    if (invalidHandlers.length > 0) {
      message.error('Todos os tratamentos de erro devem ter Status, Mensagem e Ação');
      return;
    }

    const newConfig = {
      ...config,
      ...formData,
    };

    updateTableConfig(tableId, newConfig);
    message.success('Configuração salva com sucesso!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'datatable-config.json';
    link.click();
    URL.revokeObjectURL(url);
    message.success('Configuração exportada!');
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target.result);
        setFormData({
          api: importedConfig.api || formData.api,
          pagination: importedConfig.pagination || formData.pagination,
          endpoints: importedConfig.endpoints || formData.endpoints,
          errorHandlers: importedConfig.errorHandlers || formData.errorHandlers,
        });
        message.success('Configuração importada com sucesso!');
      } catch (error) {
        message.error('Erro ao importar configuração. Verifique se o arquivo JSON é válido.');
      }
    };
    reader.readAsText(file);
    return false;
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
              Configuração Geral
            </Title>
            <Paragraph className="page-description">
              Configure a API, endpoints e tratamento de erros para "{table.name}".
            </Paragraph>
          </div>
          <Space className="button-group">
            <Upload beforeUpload={handleImport} accept=".json" showUploadList={false}>
              <Button icon={<UploadOutlined />}>Importar JSON</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Exportar JSON
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Salvar Configuração
            </Button>
          </Space>
        </div>
      </div>

      {/* API Configuration */}
      <div className="section">
        <h3 className="section-title">Configuração da API</h3>
        <Card>
          <ApiConfig
            value={formData.api}
            onChange={(api) => setFormData({ ...formData, api })}
          />
        </Card>
      </div>

      <Divider />

      {/* Pagination Configuration */}
      <div className="section">
        <h3 className="section-title">Configuração de Paginação</h3>
        <Card>
          <PaginationConfig
            value={formData.pagination}
            onChange={(pagination) => setFormData({ ...formData, pagination })}
          />
        </Card>
      </div>

      <Divider />

      {/* Endpoints */}
      <div className="section">
        <h3 className="section-title">Endpoints Disponíveis</h3>
        <Card>
          <EndpointsConfig
            value={formData.endpoints}
            onChange={(endpoints) => setFormData({ ...formData, endpoints })}
          />
        </Card>
      </div>

      <Divider />

      {/* Error Handling */}
      <div className="section">
        <h3 className="section-title">Tratamento de Erros</h3>
        <Card>
          <ErrorHandlingConfig
            value={formData.errorHandlers}
            onChange={(errorHandlers) => setFormData({ ...formData, errorHandlers })}
          />
        </Card>
      </div>

      {/* Footer Actions */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={() => navigate(`/table/${tableId}`)}>Cancelar</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Salvar Configuração
        </Button>
      </div>
    </div>
  );
};

export default ConfigGeneralPage;
