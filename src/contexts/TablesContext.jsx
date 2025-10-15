/**
 * Tables Context
 * Gerencia múltiplas tabelas configuráveis
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTables, saveTables, createNewTable, getDefaultTable } from '../services/tables-storage';

const TablesContext = createContext();

export const TablesProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [activeTableId, setActiveTableId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tables on mount
  useEffect(() => {
    const data = loadTables();
    setTables(data.tables);
    setActiveTableId(data.activeTableId);
    setLoading(false);
  }, []);

  // Save to storage whenever tables change
  useEffect(() => {
    if (!loading) {
      saveTables({ tables, activeTableId });
    }
  }, [tables, activeTableId, loading]);

  /**
   * Get active table
   */
  const getActiveTable = () => {
    return tables.find((t) => t.id === activeTableId) || null;
  };

  /**
   * Get table by ID
   */
  const getTableById = (id) => {
    return tables.find((t) => t.id === id) || null;
  };

  /**
   * Create new table
   */
  const createTable = (name, description = '', config = null) => {
    const newTable = createNewTable(name, description, config);
    setTables([...tables, newTable]);
    setActiveTableId(newTable.id);
    return newTable;
  };

  /**
   * Update table
   */
  const updateTable = (id, updates) => {
    setTables(
      tables.map((table) =>
        table.id === id
          ? {
              ...table,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : table
      )
    );
  };

  /**
   * Update table config
   */
  const updateTableConfig = (id, config) => {
    updateTable(id, { config });
  };

  /**
   * Update partial table config
   */
  const updatePartialTableConfig = (id, section, data) => {
    const table = getTableById(id);
    if (!table) return;

    const newConfig = {
      ...table.config,
      [section]: data,
    };
    updateTableConfig(id, newConfig);
  };

  /**
   * Delete table
   */
  const deleteTable = (id) => {
    const newTables = tables.filter((t) => t.id !== id);
    setTables(newTables);

    // If deleting active table, switch to first available or null
    if (id === activeTableId) {
      setActiveTableId(newTables.length > 0 ? newTables[0].id : null);
    }
  };

  /**
   * Duplicate table
   */
  const duplicateTable = (id) => {
    const table = getTableById(id);
    if (!table) return null;

    const duplicated = createNewTable(
      `${table.name} (Cópia)`,
      table.description,
      table.config
    );

    setTables([...tables, duplicated]);
    return duplicated;
  };

  /**
   * Set active table
   */
  const setActive = (id) => {
    if (tables.find((t) => t.id === id)) {
      setActiveTableId(id);
    }
  };

  /**
   * Clear table config
   */
  const clearTableConfig = (id) => {
    updateTableConfig(id, getDefaultTable().config);
  };

  /**
   * Rename table
   */
  const renameTable = (id, name) => {
    updateTable(id, { name });
  };

  /**
   * Update table description
   */
  const updateTableDescription = (id, description) => {
    updateTable(id, { description });
  };

  /**
   * Get all user tables (non-examples)
   */
  const getUserTables = () => {
    return tables.filter((t) => !t.isExample);
  };

  /**
   * Get example tables
   */
  const getExampleTables = () => {
    return tables.filter((t) => t.isExample);
  };

  /**
   * Export table to JSON file
   */
  const exportTable = (id) => {
    const table = getTableById(id);
    if (!table) return null;

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      table: {
        name: table.name,
        description: table.description,
        config: table.config,
      },
    };

    return exportData;
  };

  /**
   * Import table from JSON
   */
  const importTable = (importData, newName = null) => {
    try {
      // Validate structure
      if (!importData.table || !importData.table.config) {
        throw new Error('Formato de importação inválido');
      }

      const name = newName || `${importData.table.name} (Importada)`;
      const description = importData.table.description || '';
      const config = importData.table.config;

      const newTable = createNewTable(name, description, config);
      setTables([...tables, newTable]);
      return newTable;
    } catch (error) {
      console.error('Erro ao importar tabela:', error);
      return null;
    }
  };

  const value = {
    // State
    tables,
    activeTableId,
    loading,

    // Getters
    getActiveTable,
    getTableById,
    getUserTables,
    getExampleTables,

    // Actions
    createTable,
    updateTable,
    updateTableConfig,
    updatePartialTableConfig,
    deleteTable,
    duplicateTable,
    setActiveTable: setActive,
    clearTableConfig,
    renameTable,
    updateTableDescription,
    exportTable,
    importTable,
  };

  return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>;
};

export const useTables = () => {
  const context = useContext(TablesContext);
  if (!context) {
    throw new Error('useTables must be used within TablesProvider');
  }
  return context;
};

export default TablesContext;
