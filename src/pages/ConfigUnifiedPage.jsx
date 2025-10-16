/**
 * Config Unified Page
 * Página única com stepper para toda a configuração da tabela
 * Substitui as páginas ConfigGeneralPage, ConfigColumnsPage, ConfigMappingPage, ConfigEventsPage
 */

import React, { useState, useEffect } from 'react';
import { Card, Steps, Button, Space, Typography, message, Alert } from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  ApiOutlined,
  TableOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTables } from '../contexts/TablesContext';

// Import existing config components
import ApiConfig from '../components/ConfigPanel/ApiConfig';
import PaginationConfig from '../components/ConfigPanel/PaginationConfig';
import ErrorHandlingConfig from '../components/ConfigPanel/ErrorHandlingConfig';
import MappingConfig from '../components/ConfigPanel/MappingConfig';
import ColumnsVisualEditor from '../components/ConfigPanel/ColumnsVisualEditor';
import ClickActionsBuilder from '../components/ConfigPanel/ClickActionsBuilder';
import RowClickConfig from '../components/ConfigPanel/RowClickConfig';
import ConfigSavedModal from '../components/ConfigPanel/ConfigSavedModal';
import ColumnModeSelector from '../components/ConfigPanel/ColumnModeSelector';
import ColumnsJsonEditor from '../components/ConfigPanel/ColumnsJsonEditor';
import ColumnsCodeEditor from '../components/ConfigPanel/ColumnsCodeEditor';

const { Title, Paragraph } = Typography;

/**
 * Definição dos passos do wizard
 */
const STEPS = [
  {
    key: 'api',
    title: 'API',
    icon: <ApiOutlined />,
    description: 'Configure conexão com API',
  },
  {
    key: 'columns',
    title: 'Colunas',
    icon: <TableOutlined />,
    description: 'Defina estrutura da tabela',
  },
  {
    key: 'events',
    title: 'Eventos',
    icon: <ThunderboltOutlined />,
    description: 'Configure ações e interações',
  },
  {
    key: 'mapping',
    title: 'Mapeamento',
    icon: <LinkOutlined />,
    description: 'Mapeie dados da API',
  },
  {
    key: 'review',
    title: 'Revisão',
    icon: <CheckCircleOutlined />,
    description: 'Revise e salve',
  },
];

const ConfigUnifiedPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { getTableById, updateTableConfig, setActiveTable } = useTables();

  const table = getTableById(tableId);
  const config = table?.config;

  // Estado do passo atual
  const [currentStep, setCurrentStep] = useState(0);

  // Estados para ConfigSavedModal
  const [savedModalVisible, setSavedModalVisible] = useState(false);
  const [savedSectionName, setSavedSectionName] = useState('');

  // Estado para modo de edição de colunas
  const [columnMode, setColumnMode] = useState('visual'); // 'visual', 'json', 'code'

  // Estado completo da configuração
  const [formData, setFormData] = useState({
    api: {
      baseURL: '',
      path: '',
      pathParams: [],
      queryParams: [],
      token: '',
      headers: [],
    },
    pagination: {
      enabled: true,
      defaultPageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      showSizeChanger: true,
      startFrom: 1,
    },
    errorHandlers: [],
    columns: [],
    events: {
      onRowClick: '',
      onButtonClick: '',
      onIconClick: '',
      clickActions: [], // Biblioteca de ações reutilizáveis
      rowClick: {
        enabled: false,
        selectedAction: null,
        mode: 'visual', // 'visual' or 'code'
        customCode: '', // Código JavaScript customizado
      }, // Configuração global de click na linha
    },
    mapping: {
      dataPath: '',
      totalPath: '',
      columnMapping: [],
    },
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
        api: config.api || formData.api,
        pagination: config.pagination || formData.pagination,
        errorHandlers: config.errorHandlers || [],
        columns: config.columns || [],
        events: config.events || formData.events,
        mapping: config.mapping || formData.mapping,
      });
    }
  }, [config]);

  /**
   * Valida o passo atual antes de avançar
   */
  const validateCurrentStep = () => {
    const step = STEPS[currentStep].key;

    switch (step) {
      case 'api':
        if (!formData.api.baseURL) {
          message.error('Base URL é obrigatória');
          return false;
        }
        // Valida error handlers
        const invalidHandlers = formData.errorHandlers.filter(
          (h) => !h.status || !h.message || !h.action
        );
        if (invalidHandlers.length > 0) {
          message.error('Todos os tratamentos de erro devem ter Status, Mensagem e Ação');
          return false;
        }
        break;

      case 'columns':
        if (formData.columns.length === 0) {
          message.warning('Recomenda-se adicionar pelo menos uma coluna');
          // Permite continuar mas avisa
        }
        break;

      case 'events':
        // Validação opcional - eventos são opcionais
        break;

      case 'mapping':
        if (!formData.mapping.dataPath) {
          message.warning('Recomenda-se configurar o caminho dos dados');
          // Permite continuar mas avisa
        }
        break;

      default:
        break;
    }

    return true;
  };

  /**
   * Avança para o próximo passo
   */
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      message.success('Progresso salvo!');
    }
  };

  /**
   * Volta para o passo anterior
   */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Salva uma seção específica
   */
  const handleSaveSection = (sectionKey) => {
    if (!table) {
      message.error('Tabela não encontrada');
      return;
    }

    // Valida seção
    const step = STEPS.find(s => s.key === sectionKey);
    if (!step) {
      message.error('Seção inválida');
      return;
    }

    // Salva parcialmente
    const newConfig = {
      ...config,
      ...formData,
    };

    updateTableConfig(tableId, newConfig);

    // Salva no localStorage (backup)
    try {
      localStorage.setItem(`table_config_${tableId}`, JSON.stringify(newConfig));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }

    // Mostra modal de sucesso
    setSavedSectionName(step.title);
    setSavedModalVisible(true);

    message.success(`Seção "${step.title}" salva com sucesso!`);
  };

  /**
   * Salva toda a configuração
   */
  const handleSave = () => {
    if (!table) {
      message.error('Tabela não encontrada');
      return;
    }

    // Valida todos os passos
    if (!formData.api.baseURL) {
      message.error('Base URL é obrigatória. Volte para o passo API.');
      setCurrentStep(0);
      return;
    }

    const newConfig = {
      ...config,
      ...formData,
    };

    updateTableConfig(tableId, newConfig);
    message.success('Configuração salva com sucesso!');

    // Redireciona para a visualização da tabela
    setTimeout(() => {
      navigate(`/table/${tableId}`);
    }, 1000);
  };

  /**
   * Renderiza o conteúdo do passo atual
   */
  const renderStepContent = () => {
    const step = STEPS[currentStep].key;

    switch (step) {
      case 'api':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>Configuração da API</Title>
              <Paragraph type="secondary">
                Configure a URL base, path params, query params e autenticação.
              </Paragraph>
              <ApiConfig
                value={formData.api}
                onChange={(api) => setFormData({ ...formData, api })}
              />
            </div>
            {/* Botão Salvar Seção */}
            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                onClick={() => handleSaveSection('api')}
              >
                Salvar Configuração de API
              </Button>
            </div>
          </Space>
        );

      case 'columns':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>Estrutura das Colunas</Title>
              <Paragraph type="secondary">
                Defina as colunas da tabela, seus tipos e configurações visuais.
                Escolha o modo de edição que preferir.
              </Paragraph>

              {/* Mode Selector */}
              <ColumnModeSelector
                value={columnMode}
                onChange={setColumnMode}
              />

              {/* Conditional Rendering based on mode */}
              {columnMode === 'visual' && (
                <ColumnsVisualEditor
                  value={formData.columns}
                  onChange={(columns) => setFormData({ ...formData, columns })}
                />
              )}

              {columnMode === 'json' && (
                <ColumnsJsonEditor
                  value={formData.columns}
                  onChange={(columns) => setFormData({ ...formData, columns })}
                />
              )}

              {columnMode === 'code' && (
                <ColumnsCodeEditor
                  value={formData.columns}
                  onChange={(columns) => setFormData({ ...formData, columns })}
                />
              )}
            </div>

            {/* Botão Salvar Seção */}
            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                onClick={() => handleSaveSection('columns')}
              >
                Salvar Configuração de Colunas
              </Button>
            </div>
          </Space>
        );

      case 'events':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div>
              <Title level={4}>Configuração de Eventos e Ações</Title>
              <Paragraph type="secondary">
                Configure como a tabela responde a interações do usuário. Crie ações reutilizáveis
                e defina comportamentos para clicks em linhas, botões, ícones e links.
              </Paragraph>
            </div>

            {/* 1. Click na Linha (Global) */}
            <div>
              <RowClickConfig
                enabled={formData.events.rowClick?.enabled || false}
                selectedAction={formData.events.rowClick?.selectedAction || null}
                customCode={formData.events.rowClick?.customCode || ''}
                mode={formData.events.rowClick?.mode || 'visual'}
                clickActions={formData.events.clickActions || []}
                onChange={(rowClick) =>
                  setFormData({
                    ...formData,
                    events: { ...formData.events, rowClick },
                  })
                }
              />
            </div>

            {/* Botão Salvar Seção */}
            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                onClick={() => handleSaveSection('events')}
              >
                Salvar Configuração de Eventos
              </Button>
            </div>
          </Space>
        );

      case 'mapping':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>Mapeamento de Dados</Title>
              <Paragraph type="secondary">
                Configure como os dados da API são mapeados para a tabela.
              </Paragraph>
              <MappingConfig
                value={formData.mapping}
                onChange={(mapping) => setFormData({ ...formData, mapping })}
              />
            </div>

            {/* Botão Salvar Seção */}
            <div style={{ marginTop: 32, textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                onClick={() => handleSaveSection('mapping')}
              >
                Salvar Configuração de Mapeamento
              </Button>
            </div>
          </Space>
        );

      case 'review':
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>Revisão da Configuração</Title>
              <Paragraph type="secondary">
                Revise todas as configurações antes de salvar.
              </Paragraph>

              <Card title="API" style={{ marginBottom: 16 }}>
                <p><strong>Base URL:</strong> {formData.api.baseURL || 'Não configurado'}</p>
                <p><strong>Path:</strong> {formData.api.path || 'Não configurado'}</p>
                <p><strong>Path Params:</strong> {formData.api.pathParams?.length || 0}</p>
                <p><strong>Query Params:</strong> {formData.api.queryParams?.length || 0}</p>
              </Card>

              <Card title="Paginação" style={{ marginBottom: 16 }}>
                <p><strong>Habilitada:</strong> {formData.pagination.enabled ? 'Sim' : 'Não'}</p>
                <p><strong>Tamanho padrão:</strong> {formData.pagination.defaultPageSize}</p>
              </Card>

              <Card title="Tratamento de Erros" style={{ marginBottom: 16 }}>
                <p><strong>Handlers configurados:</strong> {formData.errorHandlers.length}</p>
              </Card>

              <Card title="Colunas" style={{ marginBottom: 16 }}>
                <p><strong>Total de colunas:</strong> {formData.columns.length}</p>
              </Card>

              <Card title="Eventos e Ações" style={{ marginBottom: 16 }}>
                <p><strong>Ações visuais configuradas:</strong> {formData.events.clickActions?.length || 0}</p>
                <p><strong>Click na linha:</strong> {formData.events.rowClick?.enabled ? 'Habilitado' : 'Desabilitado'}</p>
                {formData.events.rowClick?.enabled && (
                  <p><strong>Modo:</strong> {formData.events.rowClick?.mode === 'code' ? 'Código JavaScript' : 'Ação Visual'}</p>
                )}
              </Card>

              <Card title="Mapeamento" style={{ marginBottom: 16 }}>
                <p><strong>Data Path:</strong> {formData.mapping.dataPath || 'Não configurado'}</p>
                <p><strong>Total Path:</strong> {formData.mapping.totalPath || 'Não configurado'}</p>
              </Card>

              <Alert
                message="Pronto para salvar!"
                description="Clique em 'Salvar Configuração' para aplicar todas as mudanças."
                type="success"
                showIcon
                style={{ marginTop: 24 }}
              />
            </div>
          </Space>
        );

      default:
        return null;
    }
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
      {/* Header */}
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
              Configurar Tabela
            </Title>
            <Paragraph className="page-description">
              Configure todos os aspectos de "{table.name}" através deste wizard guiado.
            </Paragraph>
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <Card style={{ marginBottom: 24 }}>
        <Steps
          current={currentStep}
          items={STEPS.map((step) => ({
            title: step.title,
            description: step.description,
            icon: step.icon,
          }))}
          onChange={(step) => {
            // Permite navegação direta entre passos já visitados
            if (step < currentStep || validateCurrentStep()) {
              setCurrentStep(step);
            }
          }}
        />
      </Card>

      {/* Step Content */}
      <Card style={{ minHeight: 400 }}>
        {renderStepContent()}
      </Card>

      {/* Navigation Buttons */}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>

        <Space>
          <Button onClick={() => navigate(`/table/${tableId}`)}>
            Cancelar
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Próximo
            </Button>
          ) : (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Salvar Configuração
            </Button>
          )}
        </Space>
      </div>

      {/* Config Saved Modal */}
      <ConfigSavedModal
        visible={savedModalVisible}
        onClose={() => setSavedModalVisible(false)}
        tableName={table?.name || 'Tabela'}
        onViewTable={() => {
          setSavedModalVisible(false);
          navigate(`/table/${tableId}`);
        }}
        onCreateAnother={() => {
          setSavedModalVisible(false);
          navigate('/tables');
        }}
        onNextSection={() => {
          setSavedModalVisible(false);
          // Avança para próxima seção se não estiver na última
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            message.info(`Indo para: ${STEPS[currentStep + 1].title}`);
          }
        }}
        showNextSection={currentStep < STEPS.length - 1}
      />
    </div>
  );
};

export default ConfigUnifiedPage;
