/**
 * Row Click Config
 * Configuração global para click em linhas da tabela
 *
 * Permite:
 * - Habilitar/desabilitar click na linha
 * - Escolher qual ação executar quando linha for clicada
 * - Preview da ação selecionada
 */

import React, { useState, useEffect } from 'react';
import { Card, Switch, Select, Space, Typography, Alert, Tag, Empty, Radio, Divider, Form } from 'antd';
import {
  ThunderboltOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import CodeEditor from '../CodeEditor';
import ActionConfigFields from './shared/ActionConfigFields';

const { Text, Paragraph } = Typography;

/**
 * Mapeamento de tipos de ação para exibição visual
 */
const ACTION_TYPE_LABELS = {
  navigate: { label: 'Navegar', color: 'blue', icon: '🔗' },
  modal: { label: 'Abrir Modal', color: 'purple', icon: '📋' },
  api: { label: 'Chamar API', color: 'green', icon: '🌐' },
  copy: { label: 'Copiar', color: 'orange', icon: '📋' },
  download: { label: 'Download', color: 'cyan', icon: '💾' },
  javascript: { label: 'JavaScript', color: 'red', icon: '⚙️' },
};

/**
 * Ações padrão disponíveis (mesmas do ActionConfigModal)
 */
const DEFAULT_ACTIONS = [
  {
    identifier: 'navigateUrl',
    elementType: 'default',
    actionType: 'navigate',
    navigateUrl: '/details/{id}',
    isDefault: true,
  },
  {
    identifier: 'modalTitle',
    elementType: 'default',
    actionType: 'modal',
    modalTitle: 'Detalhes',
    modalContent: 'Informações do registro',
    isDefault: true,
  },
  {
    identifier: 'apiEndpoint',
    elementType: 'default',
    actionType: 'api',
    apiEndpoint: '/api/endpoint',
    apiMethod: 'POST',
    isDefault: true,
  },
  {
    identifier: 'copyField',
    elementType: 'default',
    actionType: 'copy',
    copyField: 'id',
    isDefault: true,
  },
  {
    identifier: 'downloadUrl',
    elementType: 'default',
    actionType: 'download',
    downloadUrl: '/api/download/{id}',
    isDefault: true,
  },
  {
    identifier: 'javascriptCode',
    elementType: 'default',
    actionType: 'javascript',
    javascriptCode: 'console.log(record);',
    isDefault: true,
  },
];

const RowClickConfig = ({
  enabled = false,
  selectedAction = null,
  clickActions = [],
  customCode = '',
  mode = 'visual',
  onChange
}) => {
  const [form] = Form.useForm();
  const [actionMode, setActionMode] = useState(mode); // 'visual' or 'code'
  const [actionConfig, setActionConfig] = useState({}); // Configuração da ação selecionada

  /**
   * Sync actionMode state with mode prop
   */
  useEffect(() => {
    setActionMode(mode);
  }, [mode]);

  /**
   * Handle toggle change
   */
  const handleToggle = (checked) => {
    onChange({
      enabled: checked,
      selectedAction: checked ? selectedAction : null,
      customCode: checked ? customCode : '',
      mode: checked ? actionMode : 'visual',
    });
  };

  /**
   * Handle action mode change
   */
  const handleModeChange = (mode) => {
    setActionMode(mode);
    onChange({
      enabled,
      mode,
      selectedAction: mode === 'visual' ? selectedAction : null,
      customCode: mode === 'code' ? customCode : '',
    });
  };

  /**
   * Handle action selection
   */
  const handleActionSelect = (actionId) => {
    onChange({
      enabled,
      mode: actionMode,
      selectedAction: actionId,
      customCode,
    });
  };

  /**
   * Handle custom code change
   */
  const handleCodeChange = (code) => {
    onChange({
      enabled,
      mode: actionMode,
      selectedAction,
      customCode: code,
    });
  };

  /**
   * Combina ações padrão com ações customizadas
   */
  const getAllActions = () => {
    return [...DEFAULT_ACTIONS, ...clickActions];
  };

  /**
   * Get selected action details
   */
  const getSelectedActionDetails = () => {
    if (!selectedAction) return null;
    const allActions = getAllActions();
    return allActions.find(a => a.identifier === selectedAction);
  };

  /**
   * Render action preview
   */
  const renderActionPreview = () => {
    const action = getSelectedActionDetails();
    if (!action) return null;

    const typeInfo = ACTION_TYPE_LABELS[action.actionType] || {};

    return (
      <Alert
        message="Ação Configurada"
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <Text strong>Identificador:</Text> <Text code>{action.identifier}</Text>
            </div>
            <div>
              <Text strong>Tipo:</Text>{' '}
              <Tag color={typeInfo.color} icon={<ThunderboltOutlined />}>
                {typeInfo.icon} {typeInfo.label}
              </Tag>
            </div>
            {action.actionType === 'navigate' && (
              <div>
                <Text strong>URL:</Text> <Text code>{action.navigateUrl}</Text>
              </div>
            )}
            {action.actionType === 'modal' && (
              <div>
                <Text strong>Título:</Text> <Text>{action.modalTitle}</Text>
              </div>
            )}
            {action.actionType === 'api' && (
              <div>
                <Text strong>Endpoint:</Text> <Text code>{action.apiEndpoint}</Text>
              </div>
            )}
            {action.actionType === 'javascript' && (
              <div>
                <Text strong>Código:</Text> <Text type="secondary">Código JS customizado</Text>
              </div>
            )}
          </Space>
        }
        type="success"
        showIcon
        icon={<CheckCircleOutlined />}
        style={{ marginTop: 16 }}
      />
    );
  };

  return (
    <Card
      title={
        <Space>
          <ThunderboltOutlined />
          <span>Click na Linha da Tabela</span>
        </Space>
      }
      size="small"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Info */}
        <Alert
          message="Configuração Global"
          description="Esta configuração se aplica a TODAS as linhas da tabela. Quando habilitado, clicar em qualquer linha executará a ação selecionada."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        {/* Toggle Enable/Disable */}
        <div>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>Linha Clickável:</Text>
            <Switch
              checked={enabled}
              onChange={handleToggle}
              checkedChildren="Habilitado"
              unCheckedChildren="Desabilitado"
              style={{ width: 120 }}
            />
            {enabled && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ✅ Linhas ficam clicáveis com cursor pointer
              </Text>
            )}
            {!enabled && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ⭕ Linhas não respondem a clicks
              </Text>
            )}
          </Space>
        </div>

        {/* Mode Selector */}
        {enabled && (
          <div>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>Tipo de Ação:</Text>
              <Radio.Group
                value={actionMode}
                onChange={(e) => handleModeChange(e.target.value)}
                buttonStyle="solid"
                size="large"
              >
                <Radio.Button value="visual">
                  <AppstoreOutlined /> Ação Visual
                </Radio.Button>
                <Radio.Button value="code">
                  <CodeOutlined /> Código JavaScript
                </Radio.Button>
              </Radio.Group>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {actionMode === 'visual' && '📝 Escolha uma ação pré-configurada'}
                {actionMode === 'code' && '💻 Escreva código JavaScript customizado'}
              </Text>
            </Space>
          </div>
        )}
        {/* Visual Action Selector */}
        {enabled && actionMode === 'visual' && (
          <div>
            <Space direction="vertical" size="small" style={{ width: '100%', display: 'flex' }}>
              <Text strong>Ação ao Clicar:</Text>

              <Select
                placeholder="Escolha uma ação para executar ao clicar na linha"
                value={selectedAction}
                onChange={handleActionSelect}
                style={{ width: '100%' }}
                size="large"
                showSearch
                optionFilterProp="label"
                options={getAllActions().map(action => {
                  const typeInfo = ACTION_TYPE_LABELS[action.actionType] || {};
                  return {
                    label: `${typeInfo.icon} ${action.identifier} (${typeInfo.label})`,
                    value: action.identifier,
                    action: action,
                  };
                })}
                optionRender={(option) => {
                  const action = option.data.action;
                  const typeInfo = ACTION_TYPE_LABELS[action.actionType] || {};
                  return (
                    <Space direction="vertical" size={0}>
                      <Space>
                        <Text strong>{action.identifier}</Text>
                        <Tag color={typeInfo.color} style={{ margin: 0 }}>
                          {typeInfo.label}
                        </Tag>
                        {action.isDefault && (
                          <Tag color="default" style={{ margin: 0, fontSize: '10px' }}>
                            Padrão
                          </Tag>
                        )}
                      </Space>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {action.isDefault && 'Ação pré-configurada'}
                        {!action.isDefault && action.elementType === 'button' && 'Ação de Botão'}
                        {!action.isDefault && action.elementType === 'icon' && 'Ação de Ícone'}
                        {!action.isDefault && action.elementType === 'link' && 'Ação de Link'}
                      </Text>
                    </Space>
                  );
                }}
              />

            </Space>
          </div>
        )}

        {/* Action Configuration Fields */}
        {enabled && actionMode === 'visual' && selectedAction && (
          <div>
            <Card
              size="small"
              title={<Text strong>Configuração da Ação</Text>}
              style={{ marginTop: 16, background: '#fafafa' }}
            >
              <Form form={form} layout="vertical">
                <ActionConfigFields
                  actionType={getSelectedActionDetails()?.actionType}
                  config={actionConfig}
                  onChange={setActionConfig}
                />
              </Form>
            </Card>
          </div>
        )}

        {/* Preview of Selected Action */}
        {enabled && actionMode === 'visual' && selectedAction && renderActionPreview()}

        {/* JavaScript Code Editor */}
        {enabled && actionMode === 'code' && (
          <div>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>Código JavaScript:</Text>
              <Alert
                message="Variável Disponível"
                description={
                  <div>
                    <Text>Use a variável <Text code>record</Text> para acessar os dados da linha clicada.</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Exemplo: <Text code>record.id</Text>, <Text code>record.name</Text>, <Text code>record.email</Text>
                    </Text>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 12 }}
              />
              <CodeEditor
                value={customCode}
                onChange={handleCodeChange}
                language="javascript"
                height="300px"
                placeholder={`// Exemplo: Buscar comentários do post
async function buscarComentarios() {
  const url = 'https://jsonplaceholder.typicode.com/comments?postId=' + record.id;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    const primeiros5 = dados.slice(0, 5);

    alert('Comentários do Post ' + record.id + ':\\n\\n' +
          JSON.stringify(primeiros5, null, 2));
  } catch (erro) {
    console.error("Erro:", erro);
    alert('Erro: ' + erro.message);
  }
}

buscarComentarios();`}
              />
              <Alert
                message="Dica"
                description="O código será executado quando o usuário clicar em qualquer linha da tabela. Use async/await para chamadas de API."
                type="warning"
                showIcon
                style={{ marginTop: 12 }}
              />
            </Space>
          </div>
        )}

        {/* Example */}
        {enabled && actionMode === 'visual' && !selectedAction && (
          <Alert
            message="Exemplo de Uso"
            description={
              <div>
                <Paragraph style={{ marginBottom: 8 }}>
                  Quando o usuário clicar em qualquer linha da tabela, a ação selecionada será executada
                  com os dados daquela linha (<Text code>record</Text>).
                </Paragraph>
                <Paragraph style={{ marginBottom: 0 }}>
                  <Text strong>Casos de uso comuns:</Text>
                </Paragraph>
                <ul style={{ marginTop: 4, marginBottom: 0 }}>
                  <li>Navegar para página de detalhes: <Text code>/details/{'{id}'}</Text></li>
                  <li>Abrir modal com informações completas</li>
                  <li>Copiar valores para área de transferência</li>
                  <li>Executar código JavaScript customizado</li>
                </ul>
              </div>
            }
            type="warning"
            showIcon
            style={{ background: '#fffbe6', border: '1px solid #ffe58f' }}
          />
        )}
      </Space>
    </Card>
  );
};

export default RowClickConfig;
