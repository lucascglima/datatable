/**
 * Icon Gallery
 * Galeria visual de ícones do Ant Design com busca
 */

import React, { useState, useMemo } from 'react';
import { Input, Card, Row, Col, Typography, Space, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';

const { Text } = Typography;

/**
 * Lista de ícones mais comuns do Ant Design
 * Organizada por categorias
 */
const ICON_CATEGORIES = {
  'Ações': [
    'EditOutlined', 'DeleteOutlined', 'SaveOutlined', 'CloseOutlined',
    'PlusOutlined', 'MinusOutlined', 'CheckOutlined', 'SearchOutlined',
    'DownloadOutlined', 'UploadOutlined', 'CopyOutlined', 'PrinterOutlined',
  ],
  'Navegação': [
    'ArrowLeftOutlined', 'ArrowRightOutlined', 'ArrowUpOutlined', 'ArrowDownOutlined',
    'LeftOutlined', 'RightOutlined', 'UpOutlined', 'DownOutlined',
    'DoubleLeftOutlined', 'DoubleRightOutlined', 'MenuOutlined', 'HomeOutlined',
  ],
  'Interface': [
    'SettingOutlined', 'UserOutlined', 'TeamOutlined', 'BellOutlined',
    'HeartOutlined', 'StarOutlined', 'LikeOutlined', 'DislikeOutlined',
    'EyeOutlined', 'EyeInvisibleOutlined', 'LockOutlined', 'UnlockOutlined',
  ],
  'Documentos': [
    'FileOutlined', 'FolderOutlined', 'FileTextOutlined', 'FilePdfOutlined',
    'FileWordOutlined', 'FileExcelOutlined', 'FileImageOutlined', 'FileZipOutlined',
  ],
  'Comunicação': [
    'MailOutlined', 'MessageOutlined', 'CommentOutlined', 'PhoneOutlined',
    'MobileOutlined', 'SendOutlined', 'ShareAltOutlined', 'LinkOutlined',
  ],
  'Mídia': [
    'PlayCircleOutlined', 'PauseCircleOutlined', 'StopOutlined', 'FastForwardOutlined',
    'PictureOutlined', 'CameraOutlined', 'VideoCameraOutlined', 'SoundOutlined',
  ],
  'Status': [
    'CheckCircleOutlined', 'CloseCircleOutlined', 'ExclamationCircleOutlined', 'InfoCircleOutlined',
    'WarningOutlined', 'QuestionCircleOutlined', 'LoadingOutlined', 'SyncOutlined',
  ],
  'Comércio': [
    'ShoppingOutlined', 'ShoppingCartOutlined', 'DollarOutlined', 'CreditCardOutlined',
    'WalletOutlined', 'GiftOutlined', 'TagOutlined', 'BarcodOutlined',
  ],
  'Dados': [
    'TableOutlined', 'BarChartOutlined', 'LineChartOutlined', 'PieChartOutlined',
    'DashboardOutlined', 'DatabaseOutlined', 'CloudOutlined', 'ApiOutlined',
  ],
  'Outros': [
    'CalendarOutlined', 'ClockCircleOutlined', 'EnvironmentOutlined', 'GlobalOutlined',
    'RocketOutlined', 'TrophyOutlined', 'BulbOutlined', 'ThunderboltOutlined',
  ],
};

/**
 * Componente IconGallery
 */
const IconGallery = ({ value, onChange, size = 'default' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Lista flat de todos os ícones
   */
  const allIcons = useMemo(() => {
    const icons = [];
    Object.entries(ICON_CATEGORIES).forEach(([category, iconNames]) => {
      iconNames.forEach((name) => {
        icons.push({ name, category });
      });
    });
    return icons;
  }, []);

  /**
   * Filtra ícones baseado no termo de busca
   */
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return allIcons;

    const term = searchTerm.toLowerCase();
    return allIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(term) ||
        icon.category.toLowerCase().includes(term)
    );
  }, [searchTerm, allIcons]);

  /**
   * Agrupa ícones filtrados por categoria
   */
  const groupedIcons = useMemo(() => {
    const groups = {};
    filteredIcons.forEach((icon) => {
      if (!groups[icon.category]) {
        groups[icon.category] = [];
      }
      groups[icon.category].push(icon.name);
    });
    return groups;
  }, [filteredIcons]);

  /**
   * Renderiza um ícone
   */
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    if (!IconComponent) return null;

    const isSelected = value === iconName;
    const iconSize = size === 'large' ? 32 : size === 'small' ? 16 : 24;

    return (
      <div
        key={iconName}
        onClick={() => onChange(iconName)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
          borderRadius: '8px',
          cursor: 'pointer',
          background: isSelected ? '#e6f7ff' : '#fff',
          transition: 'all 0.3s',
          minHeight: '80px',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = '#40a9ff';
            e.currentTarget.style.background = '#f0f5ff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.background = '#fff';
          }
        }}
      >
        <IconComponent style={{ fontSize: iconSize, marginBottom: 8 }} />
        <Text
          style={{
            fontSize: '11px',
            textAlign: 'center',
            wordBreak: 'break-word',
            color: isSelected ? '#1890ff' : '#595959',
          }}
        >
          {iconName.replace('Outlined', '')}
        </Text>
      </div>
    );
  };

  return (
    <div>
      {/* Busca */}
      <Input
        placeholder="Buscar ícone... (ex: edit, delete, star)"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />

      {/* Seleção atual */}
      {value && (
        <Card size="small" style={{ marginBottom: 16, background: '#f0f5ff' }}>
          <Space>
            <Text strong>Ícone selecionado:</Text>
            {Icons[value] && React.createElement(Icons[value], { style: { fontSize: 20 } })}
            <Text code>{value}</Text>
          </Space>
        </Card>
      )}

      {/* Grid de ícones */}
      {Object.keys(groupedIcons).length === 0 ? (
        <Empty description="Nenhum ícone encontrado" />
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {Object.entries(groupedIcons).map(([category, iconNames]) => (
            <div key={category} style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                {category} ({iconNames.length})
              </Text>
              <Row gutter={[8, 8]}>
                {iconNames.map((iconName) => (
                  <Col key={iconName} span={4}>
                    {renderIcon(iconName)}
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}

      {/* Info sobre customização */}
      <Card size="small" style={{ marginTop: 16, background: '#fffbe6' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          💡 Dica: Você pode adicionar mais ícones importando-os de @ant-design/icons
        </Text>
      </Card>
    </div>
  );
};

export default IconGallery;
