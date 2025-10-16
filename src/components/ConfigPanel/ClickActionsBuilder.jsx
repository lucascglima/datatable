/**
 * Click Actions Builder
 * Interface visual para configurar ações de botões, ícones e links
 * Substitui necessidade de escrever JavaScript
 */

import React, { useState } from 'react';
import { Card, Button, Space, Empty, Typography, Tag, Popconfirm, List } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LinkOutlined,
  ApiOutlined,
  CodeOutlined,
  DownloadOutlined,
  CopyOutlined,
  FormOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import ActionConfigModal from './ActionConfigModal';

const { Text, Paragraph } = Typography;

/**
 * Mapeamento de tipos de ação para ícones e labels
 */
const ACTION_TYPES = {
  navigate: {
    icon: <ArrowRightOutlined />,
    label: 'Navegar',
    color: 'blue',
    description: 'Redireciona para outra página',
  },
  modal: {
    icon: <FormOutlined />,
    label: 'Abrir Modal',
    color: 'purple',
    description: 'Exibe um modal com informações',
  },
  api: {
    icon: <ApiOutlined />,
    label: 'Chamar API',
    color: 'green',
    description: 'Faz uma requisição HTTP',
  },
  copy: {
    icon: <CopyOutlined />,
    label: 'Copiar',
    color: 'orange',
    description: 'Copia texto para área de transferência',
  },
  download: {
    icon: <DownloadOutlined />,
    label: 'Download',
    color: 'cyan',
    description: 'Baixa um arquivo',
  },
  javascript: {
    icon: <CodeOutlined />,
    label: 'JavaScript',
    color: 'red',
    description: 'Executa código JavaScript customizado',
  },
};

/**
 * Mapeamento de tipos de elemento
 */
const ELEMENT_TYPES = {
  button: { label: 'Botão', color: 'blue' },
  icon: { label: 'Ícone', color: 'purple' },
  link: { label: 'Link', color: 'green' },
};

/**
 * Componente ClickActionsBuilder
 */
const ClickActionsBuilder = ({ value = [], onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAction, setEditingAction] = useState(null);

  /**
   * Adiciona nova ação
   */
  const handleAddAction = () => {
    setEditingAction(null);
    setModalVisible(true);
  };

  /**
   * Edita ação existente
   */
  const handleEditAction = (action, index) => {
    setEditingAction({ ...action, index });
    setModalVisible(true);
  };

  /**
   * Remove ação
   */
  const handleDeleteAction = (index) => {
    const newActions = value.filter((_, i) => i !== index);
    onChange(newActions);
  };

  /**
   * Salva ação (criação ou edição)
   */
  const handleSaveAction = (actionData) => {
    let newActions;

    if (editingAction !== null && editingAction.index !== undefined) {
      // Editando ação existente
      newActions = value.map((action, i) =>
        i === editingAction.index ? actionData : action
      );
    } else {
      // Nova ação
      newActions = [...value, actionData];
    }

    onChange(newActions);
    setModalVisible(false);
    setEditingAction(null);
  };

  /**
   * Preview de uma ação
   */
  const renderActionPreview = (action) => {
    const actionType = ACTION_TYPES[action.actionType] || ACTION_TYPES.navigate;
    const elementType = ELEMENT_TYPES[action.elementType] || ELEMENT_TYPES.button;

    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Tag color={elementType.color}>{elementType.label}</Tag>
          <Tag color={actionType.color} icon={actionType.icon}>
            {actionType.label}
          </Tag>
        </Space>

        <div>
          <Text strong>Identificador:</Text> <Text code>{action.identifier}</Text>
        </div>

        {action.elementType === 'button' && (
          <div>
            <Text strong>Texto:</Text> <Text>{action.buttonText || 'N/A'}</Text>
          </div>
        )}

        {action.elementType === 'icon' && (
          <div>
            <Text strong>Ícone:</Text> <Text code>{action.iconName || 'N/A'}</Text>
          </div>
        )}

        {action.elementType === 'link' && (
          <div>
            <Text strong>Texto do Link:</Text> <Text>{action.linkText || 'N/A'}</Text>
          </div>
        )}

        {action.actionType === 'navigate' && (
          <div>
            <Text strong>URL de destino:</Text> <Text code>{action.navigateUrl || 'N/A'}</Text>
          </div>
        )}

        {action.actionType === 'modal' && (
          <div>
            <Text strong>Título do Modal:</Text> <Text>{action.modalTitle || 'N/A'}</Text>
          </div>
        )}

        {action.actionType === 'api' && (
          <div>
            <Text strong>Endpoint:</Text> <Text code>{action.apiEndpoint || 'N/A'}</Text>
          </div>
        )}

        {action.actionType === 'copy' && (
          <div>
            <Text strong>Campo a copiar:</Text> <Text code>{action.copyField || 'N/A'}</Text>
          </div>
        )}
      </Space>
    );
  };

  return (
    <div>
      {/* Header com botão de adicionar */}
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddAction}
        >
          Adicionar Ação Visual
        </Button>
      </div>

      {/* Lista de ações configuradas */}
      {value.length === 0 ? (
        <Empty
          description="Nenhuma ação configurada"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Paragraph type="secondary">
            Clique em "Adicionar Ação Visual" para criar botões, ícones ou links
            com ações customizadas sem escrever código.
          </Paragraph>
        </Empty>
      ) : (
        <List
          dataSource={value}
          renderItem={(action, index) => (
            <Card
              key={index}
              size="small"
              style={{ marginBottom: 12 }}
              extra={
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditAction(action, index)}
                  >
                    Editar
                  </Button>
                  <Popconfirm
                    title="Tem certeza que deseja remover esta ação?"
                    onConfirm={() => handleDeleteAction(index)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Remover
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              {renderActionPreview(action)}
            </Card>
          )}
        />
      )}

      {/* Informação sobre migração */}
      {value.length > 0 && (
        <Card size="small" style={{ marginTop: 16, background: '#f0f5ff', borderColor: '#adc6ff' }}>
          <Space direction="vertical" size="small">
            <Text strong>Como usar estas ações:</Text>
            <Text>
              As ações configuradas aqui podem ser referenciadas nas colunas da tabela
              usando o identificador de cada ação (ex: <Text code>editAction</Text>).
            </Text>
            <Text type="secondary">
              Estas ações visuais substituem a necessidade de escrever código JavaScript
              nos eventos onButtonClick, onIconClick e onLinkClick.
            </Text>
          </Space>
        </Card>
      )}

      {/* Action Config Modal */}
      <ActionConfigModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingAction(null);
        }}
        onSave={handleSaveAction}
        initialData={editingAction}
      />
    </div>
  );
};

export default ClickActionsBuilder;
