/**
 * Button Preview
 * Componente para preview visual de Botões do Ant Design
 */

import React from 'react';
import { Button, Card, Typography, Space, Tag } from 'antd';
import * as Icons from '@ant-design/icons';

const { Text } = Typography;

/**
 * Mapeamento de tipos de ação para exibição
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
 * ButtonPreview
 * @param {string} type - Tipo do botão (primary, default, dashed, text, link)
 * @param {string} text - Texto do botão
 * @param {string} icon - Nome do ícone (opcional)
 * @param {string} color - Cor customizada (opcional)
 * @param {string} actionType - Tipo de ação (navigate, modal, api, etc.)
 */
const ButtonPreview = ({
  type = 'default',
  text = 'Preview',
  icon = null,
  color = null,
  actionType = null
}) => {
  /**
   * Renderiza o ícone se fornecido
   */
  const renderIcon = () => {
    if (!icon) return null;

    const IconComponent = Icons[icon];
    if (!IconComponent) return null;

    return <IconComponent />;
  };

  /**
   * Obtém informações do tipo de ação
   */
  const getActionTypeInfo = () => {
    if (!actionType) return null;
    return ACTION_TYPE_LABELS[actionType] || null;
  };

  const actionInfo = getActionTypeInfo();

  return (
    <Card
      size="small"
      title={<Text strong>Preview do Botão</Text>}
      style={{
        marginTop: 12,
        background: '#f5f5f5',
        textAlign: 'center'
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ padding: '16px 0' }}>
          <Button
            type={type}
            icon={renderIcon()}
            style={color ? { backgroundColor: color, borderColor: color } : {}}
          >
            {text}
          </Button>
        </div>

        {actionInfo && (
          <div>
            <Text type="secondary" style={{ fontSize: '12px', marginRight: 8 }}>
              Ação configurada:
            </Text>
            <Tag color={actionInfo.color}>
              {actionInfo.icon} {actionInfo.label}
            </Tag>
          </div>
        )}

        <Text type="secondary" style={{ fontSize: '12px' }}>
          Este é o preview do botão que será exibido na tabela
        </Text>
      </Space>
    </Card>
  );
};

export default ButtonPreview;
