/**
 * Table Utilities
 * Helpers para validação e manipulação de tabelas
 */

/**
 * Validate table name
 */
export const validateTableName = (name, existingTables = [], currentTableId = null) => {
  // Empty name
  if (!name || name.trim() === '') {
    return {
      valid: false,
      message: 'O nome da tabela não pode estar vazio',
    };
  }

  // Too short
  if (name.trim().length < 3) {
    return {
      valid: false,
      message: 'O nome deve ter pelo menos 3 caracteres',
    };
  }

  // Too long
  if (name.length > 50) {
    return {
      valid: false,
      message: 'O nome não pode ter mais de 50 caracteres',
    };
  }

  // Check for duplicate (excluding current table if editing)
  const duplicate = existingTables.find(
    (t) => t.name.toLowerCase() === name.toLowerCase() && t.id !== currentTableId
  );

  if (duplicate) {
    return {
      valid: false,
      message: 'Já existe uma tabela com este nome',
    };
  }

  return {
    valid: true,
    message: null,
  };
};

/**
 * Validate table description
 */
export const validateTableDescription = (description) => {
  if (!description) {
    return { valid: true, message: null }; // Optional field
  }

  if (description.length > 200) {
    return {
      valid: false,
      message: 'A descrição não pode ter mais de 200 caracteres',
    };
  }

  return {
    valid: true,
    message: null,
  };
};

/**
 * Generate unique table name from base
 */
export const generateUniqueName = (baseName, existingTables) => {
  let name = baseName;
  let counter = 1;

  while (existingTables.some((t) => t.name === name)) {
    name = `${baseName} (${counter})`;
    counter++;
  }

  return name;
};

/**
 * Check if table has valid configuration
 */
export const isTableConfigured = (table) => {
  if (!table || !table.config) return false;

  const { api, columns } = table.config;

  // Must have API URL
  if (!api || !api.baseURL || api.baseURL.trim() === '') {
    return false;
  }

  // Must have at least one column configured OR allow auto-generation
  // For now, we'll say it's configured if it has API URL
  return true;
};

/**
 * Get table status info
 */
export const getTableStatus = (table) => {
  if (!table) {
    return { status: 'error', label: 'Erro', color: 'red' };
  }

  const configured = isTableConfigured(table);

  if (!configured) {
    return {
      status: 'pending',
      label: 'Não Configurada',
      color: 'orange',
      message: 'Configure a API para começar a usar esta tabela',
    };
  }

  const hasColumns = table.config.columns && table.config.columns.length > 0;

  if (!hasColumns) {
    return {
      status: 'partial',
      label: 'Parcial',
      color: 'blue',
      message: 'API configurada. As colunas serão geradas automaticamente.',
    };
  }

  return {
    status: 'ready',
    label: 'Pronta',
    color: 'green',
    message: 'Tabela configurada e pronta para uso',
  };
};

/**
 * Format date for display
 */
export const formatTableDate = (isoString) => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return 'Data inválida';
  }
};

/**
 * Get table statistics
 */
export const getTableStats = (table) => {
  if (!table || !table.config) {
    return {
      columns: 0,
      endpoints: 0,
      events: 0,
      hasAuth: false,
    };
  }

  const { columns, endpoints, events, api } = table.config;

  return {
    columns: columns?.length || 0,
    endpoints: endpoints?.length || 0,
    events: Object.values(events || {}).filter((e) => e && e?.trim() !== '').length,
    hasAuth: !!(api.token && api.token.trim() !== ''),
  };
};

/**
 * Sort tables by criteria
 */
export const sortTables = (tables, criteria = 'name') => {
  const sorted = [...tables];

  switch (criteria) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'updated':
      return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    case 'created':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    default:
      return sorted;
  }
};

/**
 * Filter tables by search query
 */
export const filterTables = (tables, query) => {
  if (!query || query.trim() === '') return tables;

  const lowerQuery = query.toLowerCase();

  return tables.filter(
    (table) =>
      table.name.toLowerCase().includes(lowerQuery) ||
      (table.description && table.description.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get table preview data
 */
export const getTablePreview = (table) => {
  const stats = getTableStats(table);
  const status = getTableStatus(table);

  return {
    id: table.id,
    name: table.name,
    description: table.description,
    status: status.status,
    statusLabel: status.label,
    statusColor: status.color,
    stats,
    updatedAt: formatTableDate(table.updatedAt),
    createdAt: formatTableDate(table.createdAt),
  };
};

export default {
  validateTableName,
  validateTableDescription,
  generateUniqueName,
  isTableConfigured,
  getTableStatus,
  formatTableDate,
  getTableStats,
  sortTables,
  filterTables,
  getTablePreview,
};
