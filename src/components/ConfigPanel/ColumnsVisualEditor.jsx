/**
 * Columns Configuration Tab
 * Configure table columns with basic settings and custom renders
 *
 * Features:
 * - Visual configuration for Tags, Buttons, Icons
 * - Real-time preview
 * - Action configuration with reusable components
 * - Custom render functions with code editor
 */

import { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space, Alert, Switch, Divider, Radio, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import IconSelector from './IconSelector';
import ColorSelector from './ColorSelector';
import IconGallery from './IconGallery';
import TagPreview from './shared/TagPreview';
import ButtonPreview from './shared/ButtonPreview';
import ActionConfigFields from './shared/ActionConfigFields';
import CodeEditor from '../CodeEditor/CodeEditor';

const { Option } = Select;

/**
 * Main Component: ColumnsConfig
 */
const ColumnsConfig = ({ value = [], onChange }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Legacy states (mantidos para compatibilidade)
  const [iconSelectorVisible, setIconSelectorVisible] = useState(false);
  const [colorSelectorVisible, setColorSelectorVisible] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [selectionTarget, setSelectionTarget] = useState(null);

  // New states for modal management
  const [iconGalleryVisible, setIconGalleryVisible] = useState(false);
  const [iconGalleryTarget, setIconGalleryTarget] = useState(null); // 'button-icon', 'icon-render'

  // ============================================================================
  // COLUMN MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Adiciona uma nova coluna
   */
  const addColumn = () => {
    onChange([
      ...value,
      {
        id: Date.now(),
        title: '',
        dataIndex: '',
        key: '',
        sortable: false,
        width: undefined,
        renderType: 'default',
        renderConfig: {},
      },
    ]);
  };

  /**
   * Remove uma coluna pelo ID
   */
  const removeColumn = (id) => {
    onChange(value.filter((col) => col.id !== id));
  };

  /**
   * Atualiza propriedades da coluna
   */
  const updateColumn = (id, updates) => {
    onChange(
      value.map((col) => (col.id === id ? { ...col, ...updates } : col))
    );
  };

  /**
   * Atualiza configuração de renderização da coluna
   */
  const updateRenderConfig = (id, renderConfig) => {
    onChange(
      value.map((col) => (col.id === id ? { ...col, renderConfig } : col))
    );
  };

  // ============================================================================
  // ICON & COLOR HANDLERS (Legacy - mantidos para compatibilidade)
  // ============================================================================

  const handleIconSelect = (iconName) => {
    if (activeColumnId && selectionTarget === 'icon') {
      const column = value.find((col) => col.id === activeColumnId);
      const currentIcons = column.renderConfig.icons || '';
      const newIcon = currentIcons ? `${currentIcons},${iconName}::` : `${iconName}::`;
      updateRenderConfig(activeColumnId, { ...column.renderConfig, icons: newIcon });
    }
    setIconSelectorVisible(false);
    setActiveColumnId(null);
    setSelectionTarget(null);
  };

  const handleColorSelect = (color) => {
    if (activeColumnId && selectionTarget) {
      const column = value.find((col) => col.id === activeColumnId);
      if (selectionTarget === 'tag-color') {
        const currentMap = column.renderConfig.colorMap || '';
        const newMap = currentMap ? `${currentMap},:${color}` : `:${color}`;
        updateRenderConfig(activeColumnId, { ...column.renderConfig, colorMap: newMap });
      } else if (selectionTarget === 'icon-color') {
        const currentIcons = column.renderConfig.icons || '';
        const newIcon = currentIcons ? `${currentIcons},:${color}:` : `:${color}:`;
        updateRenderConfig(activeColumnId, { ...column.renderConfig, icons: newIcon });
      }
    }
    setColorSelectorVisible(false);
    setActiveColumnId(null);
    setSelectionTarget(null);
  };

  // ============================================================================
  // ICON GALLERY HANDLERS (New - for buttons and icons)
  // ============================================================================

  /**
   * Abre a galeria de ícones
   */
  const openIconGallery = (columnId, target) => {
    setActiveColumnId(columnId);
    setIconGalleryTarget(target);
    setIconGalleryVisible(true);
  };

  /**
   * Manipula a seleção de ícone na galeria
   */
  const handleIconGallerySelect = (iconName) => {
    if (!activeColumnId || !iconGalleryTarget) return;

    const column = value.find((col) => col.id === activeColumnId);
    if (!column) return;

    const { renderConfig = {} } = column;

    switch (iconGalleryTarget) {
      case 'button-icon':
        // Atualiza o ícone do botão
        updateRenderConfig(activeColumnId, { ...renderConfig, buttonIcon: iconName });
        break;

      case 'icon-render':
        // Atualiza o ícone principal para renderType 'icons'
        updateRenderConfig(activeColumnId, { ...renderConfig, iconName });
        break;

      default:
        break;
    }

    // Fecha a modal
    setIconGalleryVisible(false);
    setActiveColumnId(null);
    setIconGalleryTarget(null);
  };

  /**
   * Fecha a galeria de ícones
   */
  const closeIconGallery = () => {
    setIconGalleryVisible(false);
    setActiveColumnId(null);
    setIconGalleryTarget(null);
  };

  // ============================================================================
  // RENDER TYPE CONFIGURATION
  // ============================================================================

  /**
   * Renderiza configurações específicas para cada tipo de renderização
   */
  const renderTypeConfig = (column) => {
    const { renderType, renderConfig = {} } = column;

    switch (renderType) {
      // ========================================================================
      // TAGS COM CORES
      // ========================================================================
      case 'tags':
        return (
          <Card size="small" title="Configuração de Tags" style={{ marginTop: 8 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* Texto da Tag */}
              <Form.Item label="Texto da Tag" help="Texto que será exibido na tag">
                <Input
                  placeholder="Status"
                  value={renderConfig.text || ''}
                  onChange={(e) =>
                    updateRenderConfig(column.id, { ...renderConfig, text: e.target.value })
                  }
                />
              </Form.Item>

              {/* Cor da Tag */}
              <Form.Item label="Cor da Tag">
                <Select
                  value={renderConfig.color || 'blue'}
                  onChange={(color) =>
                    updateRenderConfig(column.id, { ...renderConfig, color })
                  }
                  style={{ width: '100%' }}
                >
                  <Option value="blue">Azul</Option>
                  <Option value="green">Verde</Option>
                  <Option value="red">Vermelho</Option>
                  <Option value="orange">Laranja</Option>
                  <Option value="purple">Roxo</Option>
                  <Option value="cyan">Ciano</Option>
                  <Option value="magenta">Magenta</Option>
                  <Option value="gold">Dourado</Option>
                  <Option value="lime">Lima</Option>
                  <Option value="volcano">Vulcão</Option>
                </Select>
              </Form.Item>

              {/* Opções adicionais */}
              <Space>
                <Form.Item label="Closable" help="Tag pode ser fechada">
                  <Switch
                    checked={renderConfig.closable || false}
                    onChange={(checked) =>
                      updateRenderConfig(column.id, { ...renderConfig, closable: checked })
                    }
                  />
                </Form.Item>

                <Form.Item label="Bordered" help="Tag tem borda">
                  <Switch
                    checked={renderConfig.bordered !== false}
                    onChange={(checked) =>
                      updateRenderConfig(column.id, { ...renderConfig, bordered: checked })
                    }
                  />
                </Form.Item>
              </Space>

              {/* Preview */}
              <TagPreview
                color={renderConfig.color || 'blue'}
                text={renderConfig.text || 'Preview'}
                icon={renderConfig.icon}
                closable={renderConfig.closable || false}
                bordered={renderConfig.bordered !== false}
              />
            </Space>
          </Card>
        );

      // ========================================================================
      // BOTÕES COM AÇÕES
      // ========================================================================
      case 'buttons':
        return (
          <Card size="small" title="Configuração de Botões" style={{ marginTop: 8 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {/* Texto do Botão */}
              <Form.Item label="Texto do Botão" help="Texto exibido no botão">
                <Input
                  placeholder="Editar"
                  value={renderConfig.buttonText || ''}
                  onChange={(e) =>
                    updateRenderConfig(column.id, { ...renderConfig, buttonText: e.target.value })
                  }
                />
              </Form.Item>

              {/* Tipo do Botão */}
              <Form.Item label="Estilo do Botão">
                <Radio.Group
                  value={renderConfig.buttonType || 'default'}
                  onChange={(e) =>
                    updateRenderConfig(column.id, { ...renderConfig, buttonType: e.target.value })
                  }
                  buttonStyle="solid"
                >
                  <Radio.Button value="primary">Primário</Radio.Button>
                  <Radio.Button value="default">Padrão</Radio.Button>
                  <Radio.Button value="dashed">Tracejado</Radio.Button>
                  <Radio.Button value="text">Texto</Radio.Button>
                  <Radio.Button value="link">Link</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {/* Seleção de Ícone com Modal */}
              <Form.Item label="Ícone do Botão (opcional)">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {renderConfig.buttonIcon && (
                    <Alert
                      message="Ícone Selecionado"
                      description={
                        <Space>
                          <span>Ícone:</span>
                          <code>{renderConfig.buttonIcon}</code>
                        </Space>
                      }
                      type="success"
                      showIcon
                      closable
                      onClose={() =>
                        updateRenderConfig(column.id, { ...renderConfig, buttonIcon: null })
                      }
                    />
                  )}
                  <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => openIconGallery(column.id, 'button-icon')}
                    block
                  >
                    {renderConfig.buttonIcon ? 'Alterar Ícone' : 'Adicionar Ícone'}
                  </Button>
                </Space>
              </Form.Item>

              <Divider>Ação do Botão</Divider>

              {/* Tipo de Ação */}
              <Form.Item label="Tipo de Ação">
                <Select
                  value={renderConfig.actionType || 'navigate'}
                  onChange={(actionType) =>
                    updateRenderConfig(column.id, { ...renderConfig, actionType })
                  }
                  size="large"
                  options={[
                    { value: 'navigate', label: '🔗 Navegar para outra página' },
                    { value: 'modal', label: '📋 Abrir modal com informações' },
                    { value: 'api', label: '🌐 Chamar API (ex: deletar, atualizar)' },
                    { value: 'copy', label: '📋 Copiar texto para área de transferência' },
                    { value: 'download', label: '💾 Baixar arquivo' },
                    { value: 'javascript', label: '⚙️ Executar JavaScript customizado' },
                  ]}
                />
              </Form.Item>

              {/* Campos específicos da ação */}
              <ActionConfigFields
                actionType={renderConfig.actionType || 'navigate'}
                config={renderConfig}
                onChange={(newConfig) =>
                  updateRenderConfig(column.id, { ...renderConfig, ...newConfig })
                }
              />

              {/* Preview */}
              <ButtonPreview
                type={renderConfig.buttonType || 'default'}
                text={renderConfig.buttonText || 'Preview'}
                icon={renderConfig.buttonIcon}
                actionType={renderConfig.actionType}
              />
            </Space>
          </Card>
        );

      // ========================================================================
      // ÍCONES
      // ========================================================================
      case 'icons':
        return (
          <Card size="small" title="Configuração de Ícones" style={{ marginTop: 8 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message="Renderização com Ícones"
                description="Configure o ícone que será exibido nesta coluna. O ícone pode ter ações interativas."
                type="info"
                showIcon
              />

              {/* Seleção de Ícone */}
              <Form.Item label="Escolha o Ícone" help="Ícone que será exibido na célula">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {renderConfig.iconName && (
                    <Alert
                      message="Ícone Selecionado"
                      description={
                        <Space>
                          <span>Ícone:</span>
                          <code>{renderConfig.iconName}</code>
                        </Space>
                      }
                      type="success"
                      showIcon
                      closable
                      onClose={() =>
                        updateRenderConfig(column.id, { ...renderConfig, iconName: null })
                      }
                    />
                  )}
                  <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => openIconGallery(column.id, 'icon-render')}
                    type="primary"
                    block
                  >
                    {renderConfig.iconName ? 'Alterar Ícone' : 'Selecionar Ícone'}
                  </Button>
                </Space>
              </Form.Item>

              {/* Cor do Ícone */}
              <Form.Item label="Cor do Ícone">
                <Select
                  value={renderConfig.iconColor || 'blue'}
                  onChange={(color) =>
                    updateRenderConfig(column.id, { ...renderConfig, iconColor: color })
                  }
                  style={{ width: '100%' }}
                >
                  <Option value="blue">Azul (#1890ff)</Option>
                  <Option value="green">Verde (#52c41a)</Option>
                  <Option value="red">Vermelho (#ff4d4f)</Option>
                  <Option value="orange">Laranja (#fa8c16)</Option>
                  <Option value="purple">Roxo (#722ed1)</Option>
                  <Option value="cyan">Ciano (#13c2c2)</Option>
                  <Option value="magenta">Magenta (#eb2f96)</Option>
                  <Option value="gold">Dourado (#faad14)</Option>
                </Select>
              </Form.Item>

              {/* Tooltip */}
              <Form.Item label="Tooltip (opcional)" help="Texto que aparece ao passar o mouse">
                <Input
                  placeholder="Clique para ver detalhes"
                  value={renderConfig.iconTooltip || ''}
                  onChange={(e) =>
                    updateRenderConfig(column.id, { ...renderConfig, iconTooltip: e.target.value })
                  }
                />
              </Form.Item>

              <Divider>Ação do Ícone (opcional)</Divider>

              {/* Tipo de Ação */}
              <Form.Item label="Tipo de Ação">
                <Select
                  value={renderConfig.actionType || 'none'}
                  onChange={(actionType) =>
                    updateRenderConfig(column.id, { ...renderConfig, actionType })
                  }
                  size="large"
                  options={[
                    { value: 'none', label: '🚫 Sem ação (apenas visual)' },
                    { value: 'navigate', label: '🔗 Navegar para outra página' },
                    { value: 'modal', label: '📋 Abrir modal com informações' },
                    { value: 'api', label: '🌐 Chamar API' },
                    { value: 'copy', label: '📋 Copiar texto' },
                    { value: 'download', label: '💾 Baixar arquivo' },
                    { value: 'javascript', label: '⚙️ JavaScript customizado' },
                  ]}
                />
              </Form.Item>

              {/* Campos específicos da ação (se não for 'none') */}
              {renderConfig.actionType && renderConfig.actionType !== 'none' && (
                <ActionConfigFields
                  actionType={renderConfig.actionType}
                  config={renderConfig}
                  onChange={(newConfig) =>
                    updateRenderConfig(column.id, { ...renderConfig, ...newConfig })
                  }
                />
              )}
            </Space>
          </Card>
        );

      // ========================================================================
      // CUSTOM (Função JavaScript Customizada)
      // ========================================================================
      case 'custom':
        return (
          <Card size="small" title="Função de Render Customizada" style={{ marginTop: 8 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message="Renderização Customizada"
                description={
                  <div>
                    <p>Crie uma função JavaScript que será executada para renderizar cada célula desta coluna.</p>
                    <p style={{ marginBottom: 0 }}>
                      A função recebe três parâmetros: <code>value</code> (valor da célula),{' '}
                      <code>record</code> (linha completa) e <code>index</code> (índice da linha).
                    </p>
                  </div>
                }
                type="info"
                showIcon
              />

              <Form.Item
                label="Código da Função"
                help="Escreva o código que retorna o conteúdo a ser exibido"
              >
                <CodeEditor
                  value={renderConfig.customCode || ''}
                  onChange={(code) =>
                    updateRenderConfig(column.id, { ...renderConfig, customCode: code })
                  }
                  language="javascript"
                  height="300px"
                  placeholder={`// Exemplo: Formatar moeda
function renderCell(value, record, index) {
  // 'value' = valor da célula
  // 'record' = objeto completo da linha
  // 'index' = índice da linha

  // Exemplo 1: Formatar número como moeda
  if (typeof value === 'number') {
    return 'R$ ' + value.toFixed(2);
  }

  // Exemplo 2: Usar dados de outros campos
  if (record.status === 'active') {
    return <span style={{ color: 'green' }}>{value}</span>;
  }

  // Exemplo 3: Criar elementos customizados
  return (
    <div>
      <strong>{record.name}</strong>
      <br />
      <small>{value}</small>
    </div>
  );
}

// Retorne o resultado da função
return renderCell;`}
                />
              </Form.Item>

              <Alert
                message="Exemplos de Uso"
                description={
                  <div>
                    <p><strong>Formatar data:</strong></p>
                    <code>return new Date(value).toLocaleDateString('pt-BR');</code>

                    <p style={{ marginTop: 12 }}><strong>Condicional com cores:</strong></p>
                    <code>return value &gt; 100 ? &lt;span style=&#123;&#123;color: 'green'&#125;&#125;&gt;{'{value}'}&lt;/span&gt; : value;</code>

                    <p style={{ marginTop: 12 }}><strong>Combinar campos:</strong></p>
                    <code>return record.firstName + ' ' + record.lastName;</code>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Space>
          </Card>
        );

      // ========================================================================
      // DEFAULT (Nenhuma configuração adicional)
      // ========================================================================
      default:
        return null;
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header Info */}
      <Alert
        message="Configuração de Colunas"
        description="Configure as colunas que serão exibidas na tabela. Você pode personalizar o título, ordenação, largura e tipo de renderização."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      {/* Columns List */}
      {value.map((column, index) => (
        <Card
          key={column.id}
          title={`Coluna ${index + 1}: ${column.title || '(sem título)'}`}
          size="small"
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeColumn(column.id)}
            >
              Remover
            </Button>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Basic Column Info */}
            <Form.Item label="Título" help="Texto exibido no cabeçalho da coluna">
              <Input
                placeholder="Nome"
                value={column.title}
                onChange={(e) => updateColumn(column.id, { title: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Data Index"
              help="Nome do campo no objeto de dados (ex: 'name', 'email')"
            >
              <Input
                placeholder="name"
                value={column.dataIndex}
                onChange={(e) => updateColumn(column.id, { dataIndex: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Key" help="Chave única da coluna (geralmente igual ao dataIndex)">
              <Input
                placeholder="name"
                value={column.key}
                onChange={(e) => updateColumn(column.id, { key: e.target.value })}
              />
            </Form.Item>

            {/* Column Options */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space size="large">
                <Form.Item label="Ordenável" help="Permite ordenar a tabela por esta coluna">
                  <Switch
                    checked={column.sortable}
                    onChange={(checked) => updateColumn(column.id, { sortable: checked })}
                  />
                </Form.Item>

                <Form.Item label="Largura (px)" help="Largura fixa da coluna em pixels">
                  <InputNumber
                    placeholder="100"
                    min={50}
                    max={1000}
                    value={column.width}
                    onChange={(val) => updateColumn(column.id, { width: val })}
                  />
                </Form.Item>
              </Space>

              {/* Configuração de Ordenação Padrão */}
              {column.sortable && (
                <Form.Item
                  label="Ordenação Inicial (Opcional)"
                  help="Define se esta coluna deve iniciar ordenada"
                >
                  <Select
                    placeholder="Sem ordenação inicial"
                    value={column.defaultSortOrder || null}
                    onChange={(val) => updateColumn(column.id, { defaultSortOrder: val })}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="ascend">Ascendente (A → Z, 0 → 9)</Option>
                    <Option value="descend">Descendente (Z → A, 9 → 0)</Option>
                  </Select>
                </Form.Item>
              )}
            </Space>

            <Divider>Renderização</Divider>

            {/* Render Type Selection */}
            <Form.Item label="Tipo de Renderização">
              <Select
                value={column.renderType}
                onChange={(val) =>
                  updateColumn(column.id, { renderType: val, renderConfig: {} })
                }
              >
                <Option value="default">Padrão (Texto simples)</Option>
                <Option value="tags">Tags com Cores</Option>
                <Option value="buttons">Botões</Option>
                <Option value="icons">Ícones</Option>
                <Option value="custom">Customizado (Função JavaScript)</Option>
              </Select>
            </Form.Item>

            {/* Render Type Specific Configuration */}
            {renderTypeConfig(column)}
          </Space>
        </Card>
      ))}

      {/* Add Column Button */}
      <Button type="dashed" block icon={<PlusOutlined />} onClick={addColumn}>
        Adicionar Coluna
      </Button>

      {/* Help Section */}
      <Alert
        message="Exemplos de Configuração"
        description={
          <div>
            <p><strong>Tags com Cores:</strong></p>
            <ul style={{ marginBottom: 16 }}>
              <li>Selecione a cor e o texto da tag</li>
              <li>Ative "Closable" para tags que podem ser fechadas</li>
              <li>Use "Bordered" para adicionar borda</li>
            </ul>

            <p><strong>Botões:</strong></p>
            <ul style={{ marginBottom: 16 }}>
              <li>Configure o texto e estilo visual</li>
              <li>Adicione um ícone opcional</li>
              <li>Escolha a ação ao clicar (navegar, API, modal, etc.)</li>
            </ul>

            <p><strong>Ícones:</strong></p>
            <ul style={{ marginBottom: 16 }}>
              <li>Selecione o ícone da galeria</li>
              <li>Escolha a cor e tooltip</li>
              <li>Configure ação opcional ao clicar</li>
            </ul>

            <p><strong>Customizado:</strong></p>
            <ul>
              <li>Escreva código JavaScript para renderização avançada</li>
              <li>Acesse valor da célula, linha completa e índice</li>
              <li>Retorne elementos React ou HTML customizados</li>
            </ul>
          </div>
        }
        type="success"
        showIcon
      />

      {/* ========================================================================
          MODALS
          ======================================================================== */}

      {/* Icon Selector Modal (Legacy) */}
      <IconSelector
        visible={iconSelectorVisible}
        onSelect={handleIconSelect}
        onCancel={() => {
          setIconSelectorVisible(false);
          setActiveColumnId(null);
          setSelectionTarget(null);
        }}
      />

      {/* Color Selector Modal (Legacy) */}
      <ColorSelector
        visible={colorSelectorVisible}
        onSelect={handleColorSelect}
        onCancel={() => {
          setColorSelectorVisible(false);
          setActiveColumnId(null);
          setSelectionTarget(null);
        }}
      />

      {/* Icon Gallery Modal (New) */}
      <Modal
        title="Galeria de Ícones"
        open={iconGalleryVisible}
        onCancel={closeIconGallery}
        footer={null}
        width={900}
      >
        <IconGallery
          value={
            activeColumnId && iconGalleryTarget
              ? value.find((col) => col.id === activeColumnId)?.renderConfig?.[
                iconGalleryTarget === 'button-icon' ? 'buttonIcon' : 'iconName'
              ] || ''
              : ''
          }
          onChange={handleIconGallerySelect}
        />
      </Modal>
    </Space>
  );
};

export default ColumnsConfig;
