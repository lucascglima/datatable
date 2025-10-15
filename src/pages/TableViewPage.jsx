/**
 * Table View Page
 * Página para visualizar uma tabela específica
 * ATUALIZADO: Usando novo sistema de API com buildApiUrl e estado reativo
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Space, Typography, Skeleton, Modal, Alert } from 'antd';
import { SettingOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';
import DxpTable from '../components/dxp-table';
import { fetchData } from '../services/external-api';
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

  // Estado reativo de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const table = getTableById(tableId);
  const config = table?.config;

  // Set as active table
  useEffect(() => {
    if (tableId) {
      setActiveTable(tableId);
    }
  }, [tableId, setActiveTable]);

  /**
   * Carrega dados da API usando novo sistema
   */
  const loadData = useCallback(async (page = currentPage, pageSize = currentPageSize) => {
    if (!config || !config.api?.baseURL) {
      console.warn('⚠️ Config ou baseURL não definidos');
      return;
    }

    setLoading(true);

    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('📊 [TableViewPage] Carregando dados da tabela');
    console.log('═══════════════════════════════════════════════');

    try {
      // Monta valores dinâmicos de paginação
      const dynamicValues = {};

      // Se houver query params configurados, usa os nomes deles
      const pageParam = config.api.queryParams?.find(p => p.reference === 'PAGE_CHANGE');
      const pageSizeParam = config.api.queryParams?.find(p => p.reference === 'PAGE_SIZE_CHANGE');

      if (pageParam && pageParam.enabled) {
        dynamicValues[pageParam.name] = page;
      }

      if (pageSizeParam && pageSizeParam.enabled) {
        dynamicValues[pageSizeParam.name] = pageSize;
      }

      console.log('  📄 Página:', page);
      console.log('  📦 Tamanho:', pageSize);

      // Chama novo serviço de API
      const response = await fetchData(
        config.api,
        dynamicValues,
        config.mapping || {}
      );

      console.log('  ✅ Dados carregados com sucesso!');
      console.log('  📊 Total de registros:', response.pagination?.total || response.data.length);
      console.log('═══════════════════════════════════════════════');
      console.log('');

      setData(response.data || []);
      setTotal(response.pagination?.total || response.data.length);
      setCurrentPage(page);
      setCurrentPageSize(pageSize);

    } catch (error) {
      console.error('');
      console.error('═══════════════════════════════════════════════');
      console.error('❌ [TableViewPage] Erro ao carregar dados');
      console.error('═══════════════════════════════════════════════');
      console.error(error);
      console.error('');

      const friendlyError = getFriendlyError(error);
      Modal.error({
        title: friendlyError.title,
        content: (
          <div style={{ whiteSpace: 'pre-line' }}>
            {friendlyError.message}
            <br /><br />
            <strong>Dica:</strong> Abra o Console do navegador (F12) para ver detalhes da requisição.
          </div>
        ),
        okText: 'Entendi',
        width: 600,
      });

      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [config, currentPage, currentPageSize]);

  // Carrega dados quando config muda
  useEffect(() => {
    if (config && config.api?.baseURL) {
      loadData(1, currentPageSize); // Reset to page 1 when config changes
    }
  }, [config?.api?.baseURL, config?.api?.path]); // Only reload when URL changes

  /**
   * Handler para mudança de página
   */
  const handlePageChange = useCallback((page) => {
    console.log('');
    console.log('📄 [TableViewPage] Mudança de página:', currentPage, '→', page);
    loadData(page, currentPageSize);
  }, [loadData, currentPage, currentPageSize]);

  /**
   * Handler para mudança de tamanho de página
   */
  const handlePageSizeChange = useCallback((pageSize) => {
    console.log('');
    console.log('📦 [TableViewPage] Mudança de tamanho:', currentPageSize, '→', pageSize);
    loadData(1, pageSize); // Reset to page 1 when page size changes
  }, [loadData, currentPageSize]);

  /**
   * Handler para recarregar dados
   */
  const handleReload = () => {
    console.log('');
    console.log('🔄 [TableViewPage] Recarregando dados...');
    loadData(currentPage, currentPageSize);
  };

  /**
   * Handler para click em linha
   */
  const handleRowClick = (record) => {
    if (config?.events?.onRowClick) {
      try {
        executeCustomEvent(config.events.onRowClick, { record });
      } catch (error) {
        console.error('Error executing row click event:', error);
      }
    }
  };

  /**
   * Gera colunas da tabela
   */
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
  if (!config || !config.api?.baseURL) {
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

  // Verifica se paginação está habilitada
  const isPaginationEnabled = config.pagination?.enabled !== false;

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
              current: currentPage,
              pageSize: currentPageSize,
              total: total,
              pageSizeOptions: config.pagination?.pageSizeOptions || [10, 20, 50, 100],
            }}
            paginationEnabled={isPaginationEnabled}
            onPaginationChange={(newPagination) => {
              // DxpTable chama isso com {current, pageSize}
              if (newPagination.pageSize !== currentPageSize) {
                handlePageSizeChange(newPagination.pageSize);
              } else if (newPagination.current !== currentPage) {
                handlePageChange(newPagination.current);
              }
            }}
            rowKey={(record) => record.id || record.key || Math.random()}
            onRowClick={handleRowClick}
            onSort={(sorter) => {
              console.log('🔀 Sort:', sorter);
              // TODO: Implementar ordenação quando necessário
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default TableViewPage;
