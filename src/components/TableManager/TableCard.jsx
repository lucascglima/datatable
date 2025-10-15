/**
 * Table Card Component
 * Card visual para cada tabela na lista
 */

import React from 'react';
import { Card, Space, Tag, Dropdown, Typography, Badge, Tooltip, Button } from 'antd';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SettingOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  TableOutlined,
  ThunderboltOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { getTablePreview } from '../../utils/table-utils';

const { Text, Paragraph } = Typography;

const TableCard = ({ table, onView, onEdit, onDelete, onDuplicate, onConfigure, isActive }) => {
  const preview = getTablePreview(table);

  const menuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Ver Tabela',
      onClick: () => onView(table),
    },
    {
      key: 'configure',
      icon: <SettingOutlined />,
      label: 'Configurar',
      onClick: () => onConfigure(table),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Editar Nome/Descrição',
      onClick: () => onEdit(table),
    },
    {
      key: 'duplicate',
      icon: <CopyOutlined />,
      label: 'Duplicar',
      onClick: () => onDuplicate(table),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Excluir',
      danger: true,
      onClick: () => onDelete(table),
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      ready: '#52c41a',
      partial: '#1890ff',
      pending: '#faad14',
      error: '#ff4d4f',
    };
    return colors[status] || '#d9d9d9';
  };

  return (
    <Badge.Ribbon
      text={isActive ? 'Ativa' : null}
      color="blue"
      style={{ display: isActive ? 'block' : 'none' }}
    >
      <Card
        hoverable
        style={{
          height: '100%',
          border: isActive ? '2px solid #1890ff' : '1px solid #d9d9d9',
          borderRadius: '8px',
        }}
        bodyStyle={{ padding: '20px' }}
        actions={[
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(table)}
            key="view"
          >
            Ver
          </Button>,
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => onConfigure(table)}
            key="config"
          >
            Configurar
          </Button>,
          <Dropdown menu={{ items: menuItems }} trigger={['click']} key="more">
            <Button type="text" icon={<EllipsisOutlined />}>
              Mais
            </Button>
          </Dropdown>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Header: Nome e Status */}
          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: '16px' }}>
                {table.name}
              </Text>
              <Tag color={getStatusColor(preview.status)}>{preview.statusLabel}</Tag>
            </Space>
          </div>

          {/* Descrição */}
          {table.description && (
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, color: '#8c8c8c', fontSize: '13px' }}
            >
              {table.description}
            </Paragraph>
          )}

          {/* Estatísticas */}
          <Space size="middle" wrap>
            <Tooltip title="Número de colunas configuradas">
              <Space size={4}>
                <TableOutlined style={{ color: '#1890ff' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {preview.stats.columns} colunas
                </Text>
              </Space>
            </Tooltip>

            {preview.stats.endpoints > 0 && (
              <Tooltip title="Endpoints configurados">
                <Space size={4}>
                  <ApiOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {preview.stats.endpoints} endpoints
                  </Text>
                </Space>
              </Tooltip>
            )}

            {preview.stats.events > 0 && (
              <Tooltip title="Eventos configurados">
                <Space size={4}>
                  <ThunderboltOutlined style={{ color: '#faad14' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {preview.stats.events} eventos
                  </Text>
                </Space>
              </Tooltip>
            )}

            {preview.stats.hasAuth && (
              <Tooltip title="Autenticação configurada">
                <LockOutlined style={{ color: '#8c8c8c' }} />
              </Tooltip>
            )}
          </Space>

          {/* Data de atualização */}
          <Space size={4}>
            <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Atualizada {preview.updatedAt}
            </Text>
          </Space>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default TableCard;
