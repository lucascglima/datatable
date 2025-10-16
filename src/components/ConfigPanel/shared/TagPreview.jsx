/**
 * Tag Preview
 * Componente para preview visual de Tags do Ant Design
 */

import React from 'react';
import { Tag, Card, Typography } from 'antd';
import * as Icons from '@ant-design/icons';

const { Text } = Typography;

/**
 * TagPreview
 * @param {string} color - Cor da tag (blue, green, red, etc.)
 * @param {string} text - Texto da tag
 * @param {string} icon - Nome do ícone (opcional)
 * @param {boolean} closable - Tag pode ser fechada
 * @param {boolean} bordered - Tag tem borda
 */
const TagPreview = ({
  color = 'blue',
  text = 'Preview',
  icon = null,
  closable = false,
  bordered = true
}) => {
  /**
   * Renderiza o ícone se fornecido
   */
  const renderIcon = () => {
    if (!icon) return null;

    const IconComponent = Icons[icon];
    if (!IconComponent) return null;

    return <IconComponent style={{ marginRight: 4 }} />;
  };

  return (
    <Card
      size="small"
      title={<Text strong>Preview da Tag</Text>}
      style={{
        marginTop: 12,
        background: '#f5f5f5',
        textAlign: 'center'
      }}
    >
      <div style={{ padding: '16px 0' }}>
        <Tag
          color={color}
          closable={closable}
          bordered={bordered}
          icon={renderIcon()}
          style={{ fontSize: '14px', padding: '4px 12px' }}
        >
          {text}
        </Tag>
      </div>

      <Text type="secondary" style={{ fontSize: '12px' }}>
        Este é o preview da tag que será exibida na tabela
      </Text>
    </Card>
  );
};

export default TagPreview;
