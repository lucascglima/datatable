/**
 * Column Mode Selector
 * Seletor de modo de configuração de colunas (Visual/JSON/Code)
 *
 * Permite ao usuário escolher como prefere configurar as colunas:
 * - Visual: Interface gráfica com formulários
 * - JSON: Editor JSON puro
 * - Code: Editor de código JavaScript com render functions
 */

import React from 'react';
import { Segmented, Space, Typography, Tooltip } from 'antd';
import { FormOutlined, FileTextOutlined, CodeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ColumnModeSelector = ({ value = 'visual', onChange }) => {
  const options = [
    {
      label: (
        <Tooltip title="Interface visual com formulários - Mais fácil para iniciantes">
          <Space>
            <Text>Visual</Text>
          </Space>
        </Tooltip>
      ),
      value: 'visual',
      icon: <FormOutlined />,
    },
    {
      label: (
        <Tooltip title="Editor JSON direto - Para quem já tem a configuração pronta">
          <Space>
            <Text>JSON</Text>
          </Space>
        </Tooltip>
      ),
      value: 'json',
      icon: <FileTextOutlined />,
    },
    {
      label: (
        <Tooltip title="Editor de código com render functions - Para configurações avançadas">
          <Space>
            <Text>Code</Text>
          </Space>
        </Tooltip>
      ),
      value: 'code',
      icon: <CodeOutlined />,
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text strong>Modo de Configuração:</Text>
        <Segmented
          options={options}
          value={value}
          onChange={onChange}
          size="large"
          block
        />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {value === 'visual' && '📝 Modo Visual: Configure colunas usando formulários intuitivos'}
          {value === 'json' && '📄 Modo JSON: Cole ou edite JSON diretamente'}
          {value === 'code' && '💻 Modo Code: Escreva funções de renderização customizadas'}
        </Text>
      </Space>
    </div>
  );
};

export default ColumnModeSelector;
