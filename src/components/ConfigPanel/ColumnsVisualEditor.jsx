/**
 * Columns Configuration Tab
 * Configure table columns with basic settings and custom renders
 */

import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Space, Alert, Switch, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined, BgColorsOutlined, AppstoreOutlined } from '@ant-design/icons';
import IconSelector from './IconSelector';
import ColorSelector from './ColorSelector';

const { Option } = Select;

const ColumnsConfig = ({ value = [], onChange }) => {
  const [iconSelectorVisible, setIconSelectorVisible] = useState(false);
  const [colorSelectorVisible, setColorSelectorVisible] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [selectionTarget, setSelectionTarget] = useState(null); // 'tag-color' or 'icon-color'

  const addColumn = () => {
    onChange([
      ...value,
      {
        id: Date.now(),
        title: '',
        dataIndex: '',
        key: '',
        sortable: false,
        clickable: false,
        width: undefined,
        renderType: 'default',
        renderConfig: {},
      },
    ]);
  };

  const removeColumn = (id) => {
    onChange(value.filter((col) => col.id !== id));
  };

  const updateColumn = (id, updates) => {
    onChange(
      value.map((col) => (col.id === id ? { ...col, ...updates } : col))
    );
  };

  const updateRenderConfig = (id, renderConfig) => {
    onChange(
      value.map((col) => (col.id === id ? { ...col, renderConfig } : col))
    );
  };

  const handleIconSelect = (iconName) => {
    if (activeColumnId && selectionTarget === 'icon') {
      const column = value.find((col) => col.id === activeColumnId);
      const currentIcons = column.renderConfig.icons || '';
      const newIcon = currentIcons ? `${currentIcons},${iconName}::` : `${iconName}::`;
      updateRenderConfig(activeColumnId, { ...column.renderConfig, icons: newIcon });
    }
    setIconSelectorVisible(false);
    setActiveColumnId(null);
    setSelectionTarget(null);
  };

  const handleColorSelect = (color) => {
    if (activeColumnId && selectionTarget) {
      const column = value.find((col) => col.id === activeColumnId);
      if (selectionTarget === 'tag-color') {
        const currentMap = column.renderConfig.colorMap || '';
        const newMap = currentMap ? `${currentMap},:${color}` : `:${color}`;
        updateRenderConfig(activeColumnId, { ...column.renderConfig, colorMap: newMap });
      } else if (selectionTarget === 'icon-color') {
        const currentIcons = column.renderConfig.icons || '';
        const newIcon = currentIcons ? `${currentIcons},:${color}:` : `:${color}:`;
        updateRenderConfig(activeColumnId, { ...column.renderConfig, icons: newIcon });
      }
    }
    setColorSelectorVisible(false);
    setActiveColumnId(null);
    setSelectionTarget(null);
  };

  const renderTypeConfig = (column) => {
    const { renderType, renderConfig = {} } = column;

    switch (renderType) {
      case 'tags':
        return (
          <Card size="small" title="Configuração de Tags" style={{ marginTop: 8 }}>
            <Form.Item label="Uppercase" help="Converte o texto para maiúsculas">
              <Switch
                checked={renderConfig.uppercase || false}
                onChange={(checked) =>
                  updateRenderConfig(column.id, { ...renderConfig, uppercase: checked })
                }
              />
            </Form.Item>
            <Form.Item
              label="Mapeamento de Cores"
              help="Formato: valor1:blue,valor2:green,valor3:red"
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="active:green,inactive:red,pending:orange"
                  value={renderConfig.colorMap || ''}
                  onChange={(e) =>
                    updateRenderConfig(column.id, { ...renderConfig, colorMap: e.target.value })
                  }
                />
                <Button
                  icon={<BgColorsOutlined />}
                  onClick={() => {
                    setActiveColumnId(column.id);
                    setSelectionTarget('tag-color');
                    setColorSelectorVisible(true);
                  }}
                  title="Selecionar cor"
                />
              </Space.Compact>
            </Form.Item>
          </Card>
        );

      case 'buttons':
        return (
          <Card size="small" title="Configuração de Botões" style={{ marginTop: 8 }}>
            <Form.Item
              label="Botões"
              help="Formato: label1:primary:funcName1,label2:default:funcName2"
            >
              <Input.TextArea
                rows={3}
                placeholder="Editar:primary:handleEdit,Deletar:danger:handleDelete"
                value={renderConfig.buttons || ''}
                onChange={(e) =>
                  updateRenderConfig(column.id, { ...renderConfig, buttons: e.target.value })
                }
              />
            </Form.Item>
          </Card>
        );

      case 'icons':
        return (
          <Card size="small" title="Configuração de Ícones" style={{ marginTop: 8 }}>
            <Form.Item
              label="Ícones"
              help="Formato: IconName:color:funcName,IconName2:color2:funcName2"
            >
              <Input.TextArea
                rows={3}
                placeholder="EditOutlined:#1890ff:handleEdit,DeleteOutlined:#ff4d4f:handleDelete"
                value={renderConfig.icons || ''}
                onChange={(e) =>
                  updateRenderConfig(column.id, { ...renderConfig, icons: e.target.value })
                }
              />
            </Form.Item>
            <Space>
              <Button
                size="small"
                icon={<AppstoreOutlined />}
                onClick={() => {
                  setActiveColumnId(column.id);
                  setSelectionTarget('icon');
                  setIconSelectorVisible(true);
                }}
              >
                Selecionar Ícone
              </Button>
              <Button
                size="small"
                icon={<BgColorsOutlined />}
                onClick={() => {
                  setActiveColumnId(column.id);
                  setSelectionTarget('icon-color');
                  setColorSelectorVisible(true);
                }}
              >
                Selecionar Cor
              </Button>
            </Space>
          </Card>
        );

      case 'custom':
        return (
          <Card size="small" title="Função de Render Customizada" style={{ marginTop: 8 }}>
            <Form.Item
              label="Nome da Função"
              help="Nome da função global que será chamada para renderizar"
            >
              <Input
                placeholder="customRenderFunction"
                value={renderConfig.functionName || ''}
                onChange={(e) =>
                  updateRenderConfig(column.id, { ...renderConfig, functionName: e.target.value })
                }
              />
            </Form.Item>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Configuração de Colunas"
        description="Configure as colunas que serão exibidas na tabela. Você pode personalizar o título, ordenação, largura e tipo de renderização."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      {value.map((column, index) => (
        <Card
          key={column.id}
          title={`Coluna ${index + 1}: ${column.title || '(sem título)'}`}
          size="small"
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeColumn(column.id)}
            >
              Remover
            </Button>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Form.Item label="Título" help="Texto exibido no cabeçalho da coluna">
              <Input
                placeholder="Nome"
                value={column.title}
                onChange={(e) => updateColumn(column.id, { title: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label="Data Index"
              help="Nome do campo no objeto de dados (ex: 'name', 'email')"
            >
              <Input
                placeholder="name"
                value={column.dataIndex}
                onChange={(e) => updateColumn(column.id, { dataIndex: e.target.value })}
              />
            </Form.Item>

            <Form.Item label="Key" help="Chave única da coluna (geralmente igual ao dataIndex)">
              <Input
                placeholder="name"
                value={column.key}
                onChange={(e) => updateColumn(column.id, { key: e.target.value })}
              />
            </Form.Item>

            <Space size="large">
              <Form.Item label="Ordenável">
                <Switch
                  checked={column.sortable}
                  onChange={(checked) => updateColumn(column.id, { sortable: checked })}
                />
              </Form.Item>

              <Form.Item label="Clicável">
                <Switch
                  checked={column.clickable}
                  onChange={(checked) => updateColumn(column.id, { clickable: checked })}
                />
              </Form.Item>

              <Form.Item label="Largura (px)">
                <InputNumber
                  placeholder="100"
                  min={50}
                  max={1000}
                  value={column.width}
                  onChange={(val) => updateColumn(column.id, { width: val })}
                />
              </Form.Item>
            </Space>

            <Divider>Renderização</Divider>

            <Form.Item label="Tipo de Renderização">
              <Select
                value={column.renderType}
                onChange={(val) =>
                  updateColumn(column.id, { renderType: val, renderConfig: {} })
                }
              >
                <Option value="default">Padrão (Texto simples)</Option>
                <Option value="tags">Tags com Cores</Option>
                <Option value="buttons">Botões</Option>
                <Option value="icons">Ícones</Option>
                <Option value="custom">Customizado (Função global)</Option>
              </Select>
            </Form.Item>

            {renderTypeConfig(column)}
          </Space>
        </Card>
      ))}

      <Button type="dashed" block icon={<PlusOutlined />} onClick={addColumn}>
        Adicionar Coluna
      </Button>

      <Alert
        message="Exemplos de Configuração"
        description={
          <div>
            <p>
              <strong>Tags com Cores:</strong>
            </p>
            <ul style={{ marginBottom: 16 }}>
              <li>Mapeamento: active:green,inactive:red,pending:orange</li>
              <li>Uppercase: ativado/desativado</li>
            </ul>

            <p>
              <strong>Botões:</strong>
            </p>
            <ul style={{ marginBottom: 16 }}>
              <li>Formato: Editar:primary:handleEdit,Deletar:danger:handleDelete</li>
              <li>Tipos: primary, default, dashed, danger, link</li>
            </ul>

            <p>
              <strong>Ícones:</strong>
            </p>
            <ul>
              <li>Formato: EditOutlined:blue:handleEdit,DeleteOutlined:red:handleDelete</li>
              <li>
                Ícones disponíveis: EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined,
                etc.
              </li>
            </ul>
          </div>
        }
        type="success"
        showIcon
      />

      {/* Icon Selector Modal */}
      <IconSelector
        visible={iconSelectorVisible}
        onSelect={handleIconSelect}
        onCancel={() => {
          setIconSelectorVisible(false);
          setActiveColumnId(null);
          setSelectionTarget(null);
        }}
      />

      {/* Color Selector Modal */}
      <ColorSelector
        visible={colorSelectorVisible}
        onSelect={handleColorSelect}
        onCancel={() => {
          setColorSelectorVisible(false);
          setActiveColumnId(null);
          setSelectionTarget(null);
        }}
      />
    </Space>
  );
};

export default ColumnsConfig;
