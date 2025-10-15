/**
 * QuickStart Card Component
 * Card visual para carregar exemplos pré-configurados
 */

import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { RocketOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const QuickStartCard = ({ example, onLoad, isLoaded }) => {
  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: '8px',
        border: isLoaded ? '2px solid #52c41a' : '1px solid #d9d9d9',
      }}
      bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%', height: '100%' }}>
        {/* Icon and Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{example.icon}</div>
          <Title level={4} style={{ margin: 0 }}>
            {example.name}
          </Title>
        </div>

        {/* Description */}
        <Paragraph style={{ color: '#8c8c8c', flex: 1, margin: 0 }}>
          {example.description}
        </Paragraph>

        {/* Status Tag */}
        {isLoaded && (
          <Tag icon={<CheckCircleOutlined />} color="success" style={{ alignSelf: 'center' }}>
            Carregado
          </Tag>
        )}

        {/* Action Button */}
        <Button
          type={isLoaded ? 'default' : 'primary'}
          icon={<RocketOutlined />}
          onClick={() => onLoad(example.key)}
          block
          size="large"
        >
          {isLoaded ? 'Recarregar Este Exemplo' : 'Carregar Este Exemplo'}
        </Button>

        {/* Help Text */}
        <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
          {isLoaded
            ? 'Este exemplo já está carregado. Clique para recarregar.'
            : 'Clique para carregar esta configuração pronta'}
        </Text>
      </Space>
    </Card>
  );
};

export default QuickStartCard;
