/**
 * Column Renderer Utility
 * Generates render functions for table columns based on configuration
 */

import React from 'react';
import { Tag, Button, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { executeCustomEvent } from './event-handler';
import { executeAction, findActionByIdentifier } from './action-builder.jsx';

/**
 * Parses color map string into object
 * Format: "value1:color1,value2:color2"
 * Example: "active:green,inactive:red,pending:orange"
 */
const parseColorMap = (colorMapString) => {
  if (!colorMapString) return {};

  const map = {};
  colorMapString.split(',').forEach((pair) => {
    const [value, color] = pair.split(':').map((s) => s.trim());
    if (value && color) {
      map[value] = color;
    }
  });
  return map;
};

/**
 * Parses buttons configuration string
 * Format: "label1:type1:funcName1,label2:type2:funcName2"
 * Example: "Editar:primary:handleEdit,Deletar:danger:handleDelete"
 */
const parseButtons = (buttonsString) => {
  if (!buttonsString) return [];

  return buttonsString.split(',').map((buttonDef) => {
    const [label, type, funcName] = buttonDef.split(':').map((s) => s.trim());
    return { label, type: type || 'default', funcName };
  });
};

/**
 * Parses icons configuration string
 * Format: "IconName1:color1:funcName1,IconName2:color2:funcName2"
 * Example: "EditOutlined:blue:handleEdit,DeleteOutlined:red:handleDelete"
 */
const parseIcons = (iconsString) => {
  if (!iconsString) return [];

  return iconsString.split(',').map((iconDef) => {
    const [iconName, color, funcName] = iconDef.split(':').map((s) => s.trim());
    return { iconName, color, funcName };
  });
};

/**
 * Renders tags with color mapping
 */
const renderTags = (text, record, config) => {
  const { colorMap = {}, uppercase = false } = config;
  const displayText = uppercase && text ? String(text).toUpperCase() : text;
  const color = colorMap[text] || 'default';

  return <Tag color={color}>{displayText}</Tag>;
};

/**
 * Renders buttons
 */
const renderButtons = (text, record, buttons, eventHandler, clickActions, context) => {
  return (
    <Space size="small">
      {buttons.map((btn, index) => {
        const handleClick = (event) => {
          event.stopPropagation(); // Prevent row click

          // PRIORIDADE 1: Tentar encontrar ação visual pelo identifier
          if (clickActions && btn.funcName) {
            const action = findActionByIdentifier(clickActions, btn.funcName);
            if (action) {
              console.log('✨ [Column] Executando ação visual:', btn.funcName);
              executeAction(action, record, context);
              return;
            }
          }

          // PRIORIDADE 2: Tentar custom event handler
          if (eventHandler) {
            try {
              executeCustomEvent(eventHandler, { record, value: text, event });
              return;
            } catch (error) {
              console.error('Error executing button click event:', error);
            }
          }

          // PRIORIDADE 3: Fallback para função global (legado)
          if (btn.funcName && typeof window[btn.funcName] === 'function') {
            window[btn.funcName](record, text);
          } else {
            console.warn(`⚠️ Nenhuma ação encontrada para: ${btn.funcName}`);
          }
        };

        return (
          <Button key={index} type={btn.type} size="small" onClick={handleClick}>
            {btn.label}
          </Button>
        );
      })}
    </Space>
  );
};

/**
 * Renders icons
 */
const renderIcons = (text, record, icons, eventHandler, clickActions, context) => {
  return (
    <Space size="small">
      {icons.map((icon, index) => {
        const IconComponent = Icons[icon.iconName];

        if (!IconComponent) {
          console.warn(`Icon ${icon.iconName} not found in @ant-design/icons`);
          return null;
        }

        const handleClick = (event) => {
          event.stopPropagation(); // Prevent row click

          // PRIORIDADE 1: Tentar encontrar ação visual pelo identifier
          if (clickActions && icon.funcName) {
            const action = findActionByIdentifier(clickActions, icon.funcName);
            if (action) {
              console.log('✨ [Column] Executando ação visual:', icon.funcName);
              executeAction(action, record, context);
              return;
            }
          }

          // PRIORIDADE 2: Tentar custom event handler
          if (eventHandler) {
            try {
              executeCustomEvent(eventHandler, { record, value: text, event });
              return;
            } catch (error) {
              console.error('Error executing icon click event:', error);
            }
          }

          // PRIORIDADE 3: Fallback para função global (legado)
          if (icon.funcName && typeof window[icon.funcName] === 'function') {
            window[icon.funcName](record, text);
          } else {
            console.warn(`⚠️ Nenhuma ação encontrada para: ${icon.funcName}`);
          }
        };

        return (
          <IconComponent
            key={index}
            style={{ color: icon.color, fontSize: 16, cursor: 'pointer' }}
            onClick={handleClick}
          />
        );
      })}
    </Space>
  );
};

/**
 * Creates a render function based on column configuration
 */
export const createColumnRenderer = (column, eventHandlers = {}, clickActions = [], context = {}) => {
  const { renderType, renderConfig = {} } = column;

  switch (renderType) {
    case 'tags': {
      const colorMap = parseColorMap(renderConfig.colorMap);
      return (text, record) =>
        renderTags(text, record, { ...renderConfig, colorMap });
    }

    case 'buttons': {
      const buttons = parseButtons(renderConfig.buttons);
      return (text, record) => renderButtons(
        text,
        record,
        buttons,
        eventHandlers.onButtonClick,
        clickActions,
        context
      );
    }

    case 'icons': {
      const icons = parseIcons(renderConfig.icons);
      return (text, record) => renderIcons(
        text,
        record,
        icons,
        eventHandlers.onIconClick,
        clickActions,
        context
      );
    }

    case 'custom': {
      const { functionName } = renderConfig;
      return (text, record) => {
        if (functionName && typeof window[functionName] === 'function') {
          return window[functionName](text, record);
        }
        console.warn(`Custom render function ${functionName} not found in global scope`);
        return text;
      };
    }

    case 'default':
    default:
      return undefined; // Let Ant Design handle default rendering
  }
};

/**
 * Converts column configuration array into Ant Design columns format
 */
export const buildTableColumns = (columnsConfig, eventHandlers = {}, clickActions = [], context = {}) => {
  return columnsConfig.map((column) => {
    const antColumn = {
      title: column.title,
      dataIndex: column.dataIndex,
      key: column.key || column.dataIndex,
      // Sorter handling is now done by dxp-table-header, not here
      sortable: column.sortable, // Pass sortable flag for header to process
      defaultSortOrder: column.defaultSortOrder, // Pass default sort order if configured
      showSorterTooltip: column.sortable ? { title: 'Clique para ordenar' } : false,
      width: column.width,
    };

    // Add render function if not default
    if (column.renderType && column.renderType !== 'default') {
      antColumn.render = createColumnRenderer(column, eventHandlers, clickActions, context);
    }

    // Add click handler if clickable
    if (column.clickable) {
      antColumn.onCell = (record) => ({
        onClick: () => {
          console.log('Cell clicked:', { column: column.dataIndex, record });
          // You can add custom click handling here or call a global function
          if (typeof window.onCellClick === 'function') {
            window.onCellClick(column.dataIndex, record);
          }
        },
        style: { cursor: 'pointer' },
      });
    }

    return antColumn;
  });
};

export default {
  createColumnRenderer,
  buildTableColumns,
};
