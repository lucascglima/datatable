/**
 * Color Selector Component
 * Modal with Ant Design color tokens
 */

import React from 'react';
import { Modal, Space, Typography } from 'antd';

const { Text } = Typography;

const ColorSelector = ({ visible, onSelect, onCancel }) => {
  // Ant Design color palette
  const colorPalettes = {
    red: ['#fff1f0', '#ffccc7', '#ffa39e', '#ff7875', '#ff4d4f', '#f5222d', '#cf1322', '#a8071a', '#820014', '#5c0011'],
    volcano: ['#fff2e8', '#ffd8bf', '#ffbb96', '#ff9c6e', '#ff7a45', '#fa541c', '#d4380d', '#ad2102', '#871400', '#610b00'],
    orange: ['#fff7e6', '#ffe7ba', '#ffd591', '#ffc069', '#ffa940', '#fa8c16', '#d46b08', '#ad4e00', '#873800', '#612500'],
    gold: ['#fffbe6', '#fff1b8', '#ffe58f', '#ffd666', '#ffc53d', '#faad14', '#d48806', '#ad6800', '#874d00', '#613400'],
    yellow: ['#feffe6', '#ffffb8', '#fffb8f', '#fff566', '#ffec3d', '#fadb14', '#d4b106', '#ad8b00', '#876800', '#614700'],
    lime: ['#fcffe6', '#f4ffb8', '#eaff8f', '#d3f261', '#bae637', '#a0d911', '#7cb305', '#5b8c00', '#3f6600', '#254000'],
    green: ['#f6ffed', '#d9f7be', '#b7eb8f', '#95de64', '#73d13d', '#52c41a', '#389e0d', '#237804', '#135200', '#092b00'],
    cyan: ['#e6fffb', '#b5f5ec', '#87e8de', '#5cdbd3', '#36cfc9', '#13c2c2', '#08979c', '#006d75', '#00474f', '#002329'],
    blue: ['#e6f7ff', '#bae7ff', '#91d5ff', '#69c0ff', '#40a9ff', '#1890ff', '#096dd9', '#0050b3', '#003a8c', '#002766'],
    geekblue: ['#f0f5ff', '#d6e4ff', '#adc6ff', '#85a5ff', '#597ef7', '#2f54eb', '#1d39c4', '#10239e', '#061178', '#030852'],
    purple: ['#f9f0ff', '#efdbff', '#d3adf7', '#b37feb', '#9254de', '#722ed1', '#531dab', '#391085', '#22075e', '#120338'],
    magenta: ['#fff0f6', '#ffd6e7', '#ffadd2', '#ff85c0', '#f759ab', '#eb2f96', '#c41d7f', '#9e1068', '#780650', '#520339'],
  };

  const handleColorClick = (color) => {
    onSelect(color);
  };

  return (
    <Modal
      title="Selecionar Cor"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {Object.entries(colorPalettes).map(([name, shades]) => (
          <div key={name}>
            <Text strong style={{ textTransform: 'capitalize', marginBottom: '8px', display: 'block' }}>
              {name}
            </Text>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {shades.map((color, index) => (
                <div
                  key={color}
                  onClick={() => handleColorClick(color)}
                  title={`${name}-${index + 1}: ${color}`}
                  style={{
                    width: '60px',
                    height: '40px',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Text
                    style={{
                      fontSize: '10px',
                      color: index > 5 ? '#fff' : '#000',
                      opacity: 0.7,
                    }}
                  >
                    {index + 1}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <Text strong style={{ marginBottom: '8px', display: 'block' }}>
            Cores Básicas
          </Text>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['#000000', '#ffffff', '#d9d9d9', '#595959'].map((color) => (
              <div
                key={color}
                onClick={() => handleColorClick(color)}
                title={color}
                style={{
                  width: '60px',
                  height: '40px',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default ColorSelector;
