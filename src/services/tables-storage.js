/**
 * Tables Storage Service
 * Gerencia persistência de múltiplas tabelas no localStorage
 */

import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'datatable_tables';
const OLD_CONFIG_KEY = 'datatable_config'; // Para migração

/**
 * Default config for a new table
 */
export const getDefaultConfig = () => ({
  api: {
    baseURL: '',
    token: '',
    headers: [],
    body: [],
  },
  endpoints: [],
  columns: [],
  mapping: {
    dataPath: '',
    currentPage: '',
    totalPages: '',
    totalItems: '',
  },
  pagination: {
    enabled: true,
    pageNumberParam: 'page',
    pageSizeParam: 'limit',
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: true,
    startFrom: 1,
  },
  events: {
    onRowClick: '',
    onButtonClick: '',
    onIconClick: '',
  },
  errorHandlers: [],
});

/**
 * Create default table structure
 */
export const getDefaultTable = () => ({
  id: uuidv4(),
  name: 'Nova Tabela',
  description: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isExample: false,
  config: getDefaultConfig(),
});

/**
 * Create new table with custom data
 */
export const createNewTable = (name, description = '', config = null) => {
  return {
    id: uuidv4(),
    name: name || 'Nova Tabela',
    description: description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isExample: false,
    config: config || getDefaultConfig(),
  };
};

/**
 * Migrate old single-config to new multi-table structure
 */
const migrateOldConfig = () => {
  try {
    const oldConfig = localStorage.getItem(OLD_CONFIG_KEY);
    if (!oldConfig) return null;

    const config = JSON.parse(oldConfig);

    // Check if it's a valid config (has api.baseURL)
    if (!config.api || !config.api.baseURL) return null;

    // Create table from old config
    const migratedTable = {
      id: uuidv4(),
      name: 'Minha Tabela (Migrada)',
      description: 'Configuração migrada da versão anterior',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isExample: false,
      config: {
        ...getDefaultConfig(),
        ...config,
      },
    };

    // Remove old config
    localStorage.removeItem(OLD_CONFIG_KEY);

    console.log('✅ Configuração antiga migrada com sucesso!');
    return migratedTable;
  } catch (error) {
    console.error('❌ Erro ao migrar configuração antiga:', error);
    return null;
  }
};

/**
 * Load tables from storage
 */
export const loadTables = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
      const parsed = JSON.parse(data);
      return {
        tables: parsed.tables || [],
        activeTableId: parsed.activeTableId || null,
        settings: parsed.settings || {},
      };
    }

    // Try to migrate old config
    const migratedTable = migrateOldConfig();
    if (migratedTable) {
      const migrationData = {
        tables: [migratedTable],
        activeTableId: migratedTable.id,
        settings: {},
      };
      saveTables(migrationData);
      return migrationData;
    }

    // No data found, return empty
    return {
      tables: [],
      activeTableId: null,
      settings: {},
    };
  } catch (error) {
    console.error('Erro ao carregar tabelas:', error);
    return {
      tables: [],
      activeTableId: null,
      settings: {},
    };
  }
};

/**
 * Save tables to storage
 */
export const saveTables = (data) => {
  try {
    const toSave = {
      tables: data.tables || [],
      activeTableId: data.activeTableId || null,
      settings: data.settings || {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('Erro ao salvar tabelas:', error);
    return false;
  }
};

/**
 * Clear all tables
 */
export const clearAllTables = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Export table as JSON
 */
export const exportTable = (table) => {
  const exportData = {
    name: table.name,
    description: table.description,
    config: table.config,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import table from JSON
 */
export const importTable = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);

    // Validate basic structure
    if (!data.config) {
      throw new Error('JSON inválido: falta campo "config"');
    }

    // Create table from imported data
    return createNewTable(
      data.name || 'Tabela Importada',
      data.description || '',
      data.config
    );
  } catch (error) {
    console.error('Erro ao importar tabela:', error);
    throw new Error(`Erro ao importar: ${error.message}`);
  }
};

/**
 * Export all tables
 */
export const exportAllTables = () => {
  const data = loadTables();
  return JSON.stringify(data, null, 2);
};

/**
 * Import all tables (replaces current)
 */
export const importAllTables = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!data.tables || !Array.isArray(data.tables)) {
      throw new Error('JSON inválido: falta campo "tables" ou não é array');
    }

    saveTables(data);
    return true;
  } catch (error) {
    console.error('Erro ao importar tabelas:', error);
    throw new Error(`Erro ao importar: ${error.message}`);
  }
};

export default {
  loadTables,
  saveTables,
  clearAllTables,
  createNewTable,
  getDefaultTable,
  getDefaultConfig,
  exportTable,
  importTable,
  exportAllTables,
  importAllTables,
};
