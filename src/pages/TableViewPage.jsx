/**
 * Table View Page
 * Página para visualizar uma tabela específica
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Skeleton, Modal, Alert } from 'antd';
import { SettingOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import DxpTable from '../components/dxp-table';
import ApiService from '../services/api';
import { buildTableColumns } from '../utils/column-renderer.jsx';
import { executeCustomEvent } from '../utils/event-handler';
import { getFriendlyError } from '../utils/friendly-messages';

const { Title, Paragraph } = Typography;

const TableViewPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { getTableById, setActiveTable } = useTables();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const table = getTableById(tableId);
  const config = table?.config;

  // Set as active table
  useEffect(() => {
    if (tableId) {
      setActiveTable(tableId);
    }
  }, [tableId, setActiveTable]);

  // Load data when config changes
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

      const dataArray = response.data || [];
      setData(dataArray);

      setPagination({
        current: response.page || page,
        pageSize: pageSize,
        total: response.total || dataArray.length,
      });
    } catch (error) {
      console.error('Failed to load data:', error);

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

  const handleRowClick = (record, index, event) => {
    if (config?.events?.onRowClick) {
      try {
        executeCustomEvent(config.events.onRowClick, { record, index, event });
      } catch (error) {
        console.error('Error executing row click event:', error);
      }
    }
  };

  const getColumns = () => {
    if (config && config.columns && config.columns.length > 0) {
      const eventHandlers = config.events || {};
      return buildTableColumns(config.columns, eventHandlers);
    }

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

  // Table not found
  if (!table) {
    return (
      <div className="page-container">
        <Card>
          <Alert
            message="Tabela não encontrada"
            description="A tabela que você está procurando não existe ou foi excluída."
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

  // Table not configured
  if (!config || !config.api.baseURL) {
    return (
      <div className="page-container">
        <Card>
          <Alert
            message="Tabela não configurada"
            description="Esta tabela ainda não tem uma API configurada. Configure a API para começar a visualizar dados."
            type="warning"
            showIcon
            action={
              <Space>
                <Button onClick={() => navigate('/tables')}>
                  <ArrowLeftOutlined /> Voltar
                </Button>
                <Button
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => navigate(`/config/${tableId}/general`)}
                >
                  Configurar Agora
                </Button>
              </Space>
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
            <Space style={{ marginBottom: 8 }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/tables')}
              >
                Voltar
              </Button>
            </Space>
            <Title level={2} className="page-title">
              {table.name}
            </Title>
            {table.description && (
              <Paragraph className="page-description">
                {table.description}
              </Paragraph>
            )}
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
              onClick={() => navigate(`/config/${tableId}/general`)}
            >
              Configurar
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

export default TableViewPage;
