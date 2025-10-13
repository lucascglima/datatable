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
 * @returns {Array} Processed columns for Ant Design Table
 */
const DxpTableHeader = ({ columns, onSort }) => {
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
   * Transforms column configuration to Ant Design format
   */
  const processColumns = () => {
    return columns
      .filter(validateColumn)
      .map((column) => {
        const antColumn = {
          key: column.key,
          title: column.title,
          dataIndex: column.dataIndex,
          ...(column.width && { width: column.width }),
          ...(column.align && { align: column.align }),
          ...(column.render && { render: column.render }),
        };

        // Add sorting configuration if sortable
        if (column.sortable) {
          antColumn.sorter = true;
          antColumn.sortDirections = ['ascend', 'descend'];
        }

        return antColumn;
      });
  };

  /**
   * Handles sort change events from Ant Design Table
   * Transforms Ant Design sort event to simplified format
   */
  const handleSortChange = (pagination, filters, sorter) => {
    if (sorter && sorter.column) {
      onSort({
        columnKey: sorter.columnKey || sorter.field,
        order: sorter.order || null,
      });
    } else {
      // Sort was cleared
      onSort({
        columnKey: null,
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
