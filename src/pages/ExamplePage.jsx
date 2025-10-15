/**
 * Example Page
 * Página de exemplo com tabela configurável funcional
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Empty, Skeleton, Tabs, Modal } from 'antd';
import { SettingOutlined, ReloadOutlined, FileTextOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DxpTable from '../components/dxp-table';
import ApiService from '../services/api';
import { useConfig } from '../contexts/ConfigContext';
import { buildTableColumns } from '../utils/column-renderer.jsx';
import { executeCustomEvent } from '../utils/event-handler';
import QuickStart from '../components/QuickStart';
import { getFriendlyError } from '../utils/friendly-messages';

const { Title, Paragraph } = Typography;

const ExamplePage = () => {
  const navigate = useNavigate();
  const { config, setConfig } = useConfig();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedExample, setLoadedExample] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    if (config && config.api.baseURL) {
      loadData(config);
    }
  }, [config]);

  const loadData = async (cfg, page = 1, pageSize = 20) => {
    if (!cfg || !cfg.api.baseURL) return;

    setLoading(true);
    try {
      const apiService = new ApiService({
        ...cfg.api,
        mapping: cfg.mapping,
        pagination: cfg.pagination,
      });
      const response = await apiService.get('', { page, pageSize });

      // Response should now be standardized: { data, page, totalPages, total }
      const dataArray = response.data || [];
      setData(dataArray);

      setPagination({
        current: response.page || page,
        pageSize: pageSize,
        total: response.total || dataArray.length,
      });
    } catch (error) {
      console.error('Failed to load data:', error);

      // Show friendly error message
      const friendlyError = getFriendlyError(error);
      Modal.error({
        title: friendlyError.title,
        content: (
          <div style={{ whiteSpace: 'pre-line' }}>
            {friendlyError.message}
          </div>
        ),
        okText: 'Entendi',
        width: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    if (config) {
      loadData(config, pagination.current, pagination.pageSize);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: pagination.total });
    if (config) {
      loadData(config, page, pageSize);
    }
  };

  // Handle row click event
  const handleRowClick = (record, index, event) => {
    if (config?.events?.onRowClick) {
      try {
        executeCustomEvent(config.events.onRowClick, { record, index, event });
      } catch (error) {
        console.error('Error executing row click event:', error);
      }
    }
  };

  // Get columns: use configured columns or auto-generate from data
  const getColumns = () => {
    // If columns are configured, use them
    if (config && config.columns && config.columns.length > 0) {
      // Pass event handlers to column renderer
      const eventHandlers = config.events || {};
      return buildTableColumns(config.columns, eventHandlers);
    }

    // Otherwise, auto-generate from data
    if (!data || data.length === 0) return [];

    const firstItem = data[0];
    return Object.keys(firstItem).map((key) => ({
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      sorter: (a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal);
        }
        return aVal - bVal;
      },
    }));
  };

  // Handle loading example
  const handleLoadExample = (exampleConfig, exampleKey) => {
    setConfig(exampleConfig);
    setLoadedExample(exampleKey);
  };

  // Empty state when no configuration
  if (!config || !config.api.baseURL) {
    const tabItems = [
      {
        key: 'quickstart',
        label: (
          <span>
            <RocketOutlined /> Começar Rapidamente
          </span>
        ),
        children: (
          <QuickStart onLoadExample={handleLoadExample} currentExample={loadedExample} />
        ),
      },
      {
        key: 'manual',
        label: (
          <span>
            <SettingOutlined /> Configuração Manual
          </span>
        ),
        children: (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size="small">
                  <Title level={4} style={{ margin: 0 }}>
                    Configuração Manual
                  </Title>
                  <Paragraph style={{ color: '#8c8c8c', marginBottom: 0 }}>
                    Configure manualmente a API e as colunas da tabela.
                  </Paragraph>
                </Space>
              }
            >
              <Space>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => navigate('/config/general')}
                  size="large"
                >
                  Ir para Configuração
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => navigate('/documentation')}
                  size="large"
                >
                  Ver Documentação
                </Button>
              </Space>
            </Empty>
          </div>
        ),
      },
    ];

    return (
      <div className="page-container">
        <div className="page-header">
          <Title level={2} className="page-title">
            Bem-vindo ao DataTable Pro! 🎉
          </Title>
          <Paragraph className="page-description">
            Escolha como você quer começar: use um exemplo pronto ou configure manualmente.
          </Paragraph>
        </div>
        <Card>
          <Tabs defaultActiveKey="quickstart" items={tabItems} size="large" />
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} className="page-title">
              Exemplo de Tabela Configurável
            </Title>
            <Paragraph className="page-description">
              Visualize os dados da API configurada com as colunas personalizadas.
            </Paragraph>
          </div>
          <Space className="button-group">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReload}
              loading={loading}
            >
              Recarregar
            </Button>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => navigate('/config/general')}
            >
              Editar Configuração
            </Button>
          </Space>
        </div>
      </div>

      <Card>
        {loading && data.length === 0 ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <DxpTable
            columns={getColumns()}
            data={data}
            loading={loading}
            pagination={{
              ...pagination,
              onChange: handlePaginationChange,
              showSizeChanger: true,
              showTotal: (total) => `Total de ${total} itens`,
            }}
            rowKey="id"
            onRowClick={handleRowClick}
          />
        )}
      </Card>
    </div>
  );
};

export default ExamplePage;
