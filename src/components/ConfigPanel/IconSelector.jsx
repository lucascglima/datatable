/**
 * Icon Selector Component
 * Modal with searchable grid of Ant Design icons
 */

import React, { useState } from 'react';
import { Modal, Input, Space, Typography, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';

const { Text } = Typography;

const IconSelector = ({ visible, onSelect, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Top 50 most commonly used Ant Design icons
  const popularIcons = [
    'CheckOutlined',
    'CloseOutlined',
    'DeleteOutlined',
    'EditOutlined',
    'EyeOutlined',
    'EyeInvisibleOutlined',
    'PlusOutlined',
    'MinusOutlined',
    'DownloadOutlined',
    'UploadOutlined',
    'SearchOutlined',
    'FilterOutlined',
    'SettingOutlined',
    'UserOutlined',
    'TeamOutlined',
    'HomeOutlined',
    'FileOutlined',
    'FolderOutlined',
    'SaveOutlined',
    'CopyOutlined',
    'ShareAltOutlined',
    'HeartOutlined',
    'StarOutlined',
    'LikeOutlined',
    'DislikeOutlined',
    'MessageOutlined',
    'NotificationOutlined',
    'BellOutlined',
    'MailOutlined',
    'PhoneOutlined',
    'CameraOutlined',
    'PictureOutlined',
    'VideoCameraOutlined',
    'CalendarOutlined',
    'ClockCircleOutlined',
    'EnvironmentOutlined',
    'GlobalOutlined',
    'LinkOutlined',
    'LockOutlined',
    'UnlockOutlined',
    'SafetyOutlined',
    'KeyOutlined',
    'LogoutOutlined',
    'LoginOutlined',
    'MenuOutlined',
    'MoreOutlined',
    'InfoCircleOutlined',
    'QuestionCircleOutlined',
    'WarningOutlined',
    'ExclamationCircleOutlined',
    'CloseCircleOutlined',
    'CheckCircleOutlined',
  ];

  const filteredIcons = popularIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconClick = (iconName) => {
    onSelect(iconName);
    setSearchTerm('');
  };

  return (
    <Modal
      title="Selecionar Ícone"
      open={visible}
      onCancel={() => {
        setSearchTerm('');
        onCancel();
      }}
      footer={null}
      width={600}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input
          placeholder="Buscar ícone..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        {filteredIcons.length === 0 ? (
          <Empty description="Nenhum ícone encontrado" />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {filteredIcons.map((iconName) => {
              const IconComponent = Icons[iconName];
              return (
                <div
                  key={iconName}
                  onClick={() => handleIconClick(iconName)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.backgroundColor = '#f0f5ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <IconComponent style={{ fontSize: '24px', marginBottom: '4px' }} />
                  <Text
                    style={{
                      fontSize: '10px',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                    }}
                  >
                    {iconName.replace('Outlined', '')}
                  </Text>
                </div>
              );
            })}
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default IconSelector;
