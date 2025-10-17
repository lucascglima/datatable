import React from 'react';
import { dxpTableHeaderPropTypes, dxpTableHeaderDefaultProps } from './dxp-table.types';

/**
 * DxpTableHeader Component
 *
 * Processes and transforms column configuration for Ant Design Table.
 * Handles sorting logic and emits sort events.
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column configurations
 * @param {Function} props.onSort - Callback function when column is sorted
 * @param {Object} props.sortingConfig - Optional sorting configuration (defaultColumn, defaultOrder, sortKeys)
 * @param {string} props.currentSortField - Current active sort field key
 * @param {string} props.currentSortOrder - Current active sort order ('ascend' or 'descend')
 * @returns {Array} Processed columns for Ant Design Table
 */
const DxpTableHeader = ({ columns, onSort, sortingConfig = {}, currentSortField = null, currentSortOrder = null }) => {
  /**
   * Validates that essential column properties are present
   */
  const validateColumn = (column) => {
    if (!column.key) {
      console.error('Column is missing required property: key', column);
      return false;
    }
    if (!column.title) {
      console.error('Column is missing required property: title', column);
      return false;
    }
    if (!column.dataIndex) {
      console.error('Column is missing required property: dataIndex', column);
      return false;
    }
    return true;
  };

  /**
   * Gets the sort key for a column
   * Uses sortKeys mapping if configured, otherwise uses column key
   */
  const getSortKey = (columnKey) => {
    if (sortingConfig.sortKeys && sortingConfig.sortKeys[columnKey]) {
      return sortingConfig.sortKeys[columnKey];
    }
    return columnKey;
  };

  /**
   * Gets default sort order for initial rendering
   */
  const getDefaultSortOrder = (columnKey) => {
    if (!sortingConfig.defaultColumn || sortingConfig.defaultColumn !== columnKey) {
      return null;
    }
    return sortingConfig.defaultOrder || 'ascend';
  };

  /**
   * Transforms column configuration to Ant Design format
   */
  const processColumns = () => {
    return columns
      .filter(validateColumn)
      .map((column) => {
        // Create custom renderer based on column configuration
        

        const antColumn = {
          key: column.key,
          title: column.title,
          dataIndex: column.dataIndex,
          ...(column.width && { width: column.width }),
          ...(column.align && { align: column.align }),
          // Use custom renderer if defined, otherwise use column.render if provided
          render: column.render,
        };

        // Add sorting configuration if sortable
        if (column.sortable) {
          antColumn.sorter = true;
          antColumn.sortDirections = ['ascend', 'descend'];

          // Se esta coluna está sendo ordenada atualmente, define sortOrder
          if (currentSortField === column.key && currentSortOrder) {
            antColumn.sortOrder = currentSortOrder;
          } else if (currentSortField === null || currentSortField === undefined) {
            // Se não há ordenação ativa, usa defaultSortOrder se configurado
            const defaultOrder = column.defaultSortOrder || getDefaultSortOrder(column.key);
            if (defaultOrder) {
              antColumn.defaultSortOrder = defaultOrder;
            }
          } else {
            // Esta coluna não está sendo ordenada, remove qualquer indicação de sort
            antColumn.sortOrder = false;
          }
        }

        return antColumn;
      });
  };

  /**
   * Handles sort change events from Ant Design Table
   * Transforms Ant Design sort event to simplified format with custom sort keys
   */
  const handleSortChange = (pagination, filters, sorter) => {
    if (sorter && sorter.column) {
      const columnKey = sorter.columnKey || sorter.field;
      const sortKey = getSortKey(columnKey);

      onSort({
        columnKey,
        sortKey, // The actual key to send to API
        order: sorter.order || null,
      });
    } else {
      // Sort was cleared
      onSort({
        columnKey: null,
        sortKey: null,
        order: null,
      });
    }
  };

  return {
    columns: processColumns(),
    onChange: handleSortChange,
  };
};

DxpTableHeader.propTypes = dxpTableHeaderPropTypes;
DxpTableHeader.defaultProps = dxpTableHeaderDefaultProps;

export default DxpTableHeader;
